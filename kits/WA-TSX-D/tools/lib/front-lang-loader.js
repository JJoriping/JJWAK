const FS = require("fs");
const Path = require("path");
const { SETTINGS } = require("./common");
const HTTP = SETTINGS['https'] ? require("https") : require("http");

const RENDER_GAP = 500;
let timer;

for(const v of FS.readdirSync("./data/lang")){
  onTick(v);
}
if(process.argv[2] === "!"){
  setTimeout(() => {
    process.exit();
  }, 3000);
}
FS.watch("./data/lang", (e, file) => {
  console.info(`[LANG] Change ${file}`);

  if(timer){
    clearTimeout(timer);
  }
  timer = setTimeout(onTick, RENDER_GAP, file);
});
function onTick(file){
  const chunk = file.split('.');
  const locale = chunk[0];
  const data = JSON.parse(FS.readFileSync(Path.resolve("./data/lang", file)).toString());

  if(locale in SETTINGS['language-support']) switch(chunk[1]){
    case "json":{
      const files = FS.readdirSync("./dist/strings").filter(v => v.includes(locale));
      let updated = 0;

      for(const k in data){
        if(k.startsWith("$") || k.startsWith("@")){
          continue;
        }
        const target = `./dist/strings/${locale}.${k}.js`;
        const baby = Object.assign(
          {},
          data['$global'],
          (data[k]['$include'] || []).reduce(resolveDependency, {}),
          data[k]
        );
        let index = files.indexOf(`${locale}.${k}.js`);

        delete baby['$include'];
        FS.writeFileSync(target, `window.__LANGUAGE=${JSON.stringify(baby)}`);
        if(index !== -1){
          files.splice(index, 1);
        }
        updated++;
      }
      for(const v of files){
        FS.unlinkSync(Path.resolve("./dist/strings", v));
      }
      console.info("[LANG] Application", `${updated} updated`, `${files.length} removed`);
    } break;
    case "achievements":
    case "items":
    case "planets":
      HTTP.get({
        hostname: "localhost",
        port: SETTINGS['port'],
        path: "/janus/load-languages",
        rejectUnauthorized: false
      }).on('error', err => {
        console.error(`[LANG] ${chunk[1]}`, err);
      });
      break;
  }

  function resolveDependency(pv, v){
    const table = data[`@${v}`] || {};
    const include = table['$include'] || [];

    return Object.assign(
      pv,
      include.reduce(resolveDependency, {}),
      table
    );
  }
}