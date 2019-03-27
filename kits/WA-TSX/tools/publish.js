const FS = require("fs");
const Path = require("path").posix;
const SSH = require("ssh2-promise");
const Logger = require("jj-log").default;

const SETTINGS = require("../data/settings.json");
const SOURCE = Path.resolve(__dirname, "..");

const DESTINATION = "/jjo/server";
const SYNC = [ "data", "dist" ];

const CACHE_PATH = "./tools/publish-cache.json";
const START_TIME = Date.now();

async function main(){
  const cache = FS.existsSync(CACHE_PATH)
    ? JSON.parse(FS.readFileSync(CACHE_PATH).toString())
    : {}
  ;
  const table = createTable(SOURCE, SYNC);
  const changes = listChanges(".", cache, table);

  if(changes.length){
    Logger.info(`${changes.length} changes detected.`);
    await upload(changes);
    FS.writeFileSync(CACHE_PATH, JSON.stringify(table, null, 2));
  }else{
    Logger.info("No changes detected.");
  }
}
function createTable(parent, list){
  const R = {};

  for(const v of list){
    const path = Path.join(parent, v);
    let stat;

    if(!FS.existsSync(path)){
      Logger.warn("404", path);
      continue;
    }
    stat = FS.lstatSync(path);
    if(stat.isDirectory()){
      R[v] = createTable(path, FS.readdirSync(path));
    }else{
      R[v] = stat.mtimeMs;
    }
  }
  return R;
}
function listChanges(parent, prev, next){
  const R = [];

  for(const v in next){
    const path = Path.join(parent, v);

    if(!prev[v]){
      // 로컬에서 생성
      R.push(path);
    }
    if(typeof next[v] === "number"){
      if(prev[v] < next[v]){
        // 로컬에서 수정
        R.push(path);
      }
    }else{
      R.push(...listChanges(path, prev[v] || {}, next[v]));
    }
  }
  return R;
}
async function upload(changes){
  const client = new SSH.SFTP(new SSH(SETTINGS['ssh'], true));

  for(const v of changes){
    const pathSrc = Path.join(SOURCE, v);
    const pathDest = Path.join(DESTINATION, v);
    const stat = FS.lstatSync(pathSrc);

    if(stat.isSymbolicLink()){
      Logger.warn("Symbolic Link", pathSrc);
      continue;
    }
    if(stat.isDirectory()){
      try{
        await client.mkdir(Path.join(DESTINATION, v));
      }catch(e){
        Logger.error(v, e);
      }
    }else{
      const data = FS.readFileSync(pathSrc);

      await client.writeFile(pathDest, data);
    }
  }
}
main().then(() => {
  Logger.success(`Done in ${Date.now() - START_TIME} ms`);
  process.exit();
});