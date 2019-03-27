const FS = require("fs");
const ChildProcess = require("child_process");
const MD5 = require("md5-file");
const NCP = require("ncp").ncp;
const ReadLine = require("readline-sync");
const JJLog = require("jj-log").default;

const CWD = process.cwd();
const EMPTY = `${__dirname}/empty`;
const mergedFiles = [];

function main(){
  JJLog.success("Welcome to JJWAK!");
  // 추후 WA-TSX 키트 외의 다른 키트가 생기게 된다면
  // 이곳에서 키트를 고를 수 있도록 해야 한다.
  const KIT = "WA-TSX";
  const KIT_PATH = `${__dirname}/kits/${KIT}`;

  // 프로젝트가 이미 존재한다면 이전 버전의 JJWAK을 대체한다.
  if(FS.existsSync(`${CWD}/package.json`)){
    JJLog.warn("A project already exists here!");
    if(ReadLine.question("Proceed? (y/n): ") === "y"){
      merge(KIT_PATH);
      JJLog.warn(`Merged file(s): (${mergedFiles.length} total)`, ...mergedFiles);
      JJLog.warn("Please check them all!");
    }else{
      process.exit();
    }
    return;
  }
  // 그렇지 않다면 단순 복사한다.
  NCP(KIT_PATH, CWD, err => {
    if(err) return JJLog.error(err);
    FS.mkdirSync(`${CWD}/dist/libs`);
    JJLog.success(`The kit ${KIT} has been copied to ${CWD}!`);
    
    JJLog.info("You can use these commands to install and build completely:");
    JJLog.info("\t> yarn run settle");
    JJLog.info("\t> yarn start");
  });
}
function merge(PATH, sub = ""){
  const dir = `${PATH}${sub}`;

  JJLog.info(`Merging in ${dir}`);
  for(const v of FS.readdirSync(dir)){
    const pathSrc = `${dir}/${v}`;
    const pathDest = `${CWD}${sub}/${v}`;
    let result;
    let hashSrc, hashDest;

    if(FS.statSync(pathSrc).isDirectory()){
      if(!FS.existsSync(pathDest)){
        JJLog.log(`New directory: ${pathDest}`);
        FS.mkdirSync(pathDest);
      }
      merge(PATH, `${sub}/${v}`);
      continue;
    }
    JJLog.log("Compare two files:", pathSrc, pathDest);
    if(!FS.existsSync(pathDest)){
      JJLog.log(`New file: ${pathDest}`);
      FS.copyFileSync(pathSrc, pathDest);
      continue;
    }
    if(MD5.sync(pathSrc) === MD5.sync(pathDest)) continue;
    result = ChildProcess.spawnSync("git", [
      "merge-file", pathDest, EMPTY, pathSrc, "-p"
    ]).stdout;
    FS.writeFileSync(pathDest, result);
    mergedFiles.push(pathDest);
  }
}
main();