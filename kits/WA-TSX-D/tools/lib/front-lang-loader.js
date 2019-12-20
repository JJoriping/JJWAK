const FS = require("fs");
const Path = require("path");

const RENDER_GAP = 500;
let timer;

for(const v of FS.readdirSync("./data/lang")){
  onTick(v);
}
if(process.argv[2] === "!"){
  process.exit();
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

  switch(chunk[1]){
    case "json":{
      const files = FS.readdirSync("./dist/strings");
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