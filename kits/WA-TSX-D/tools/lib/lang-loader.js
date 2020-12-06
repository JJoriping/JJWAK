const FS = require("fs");
const HTTPS = require("https");
const Path = require("path");

const { SETTINGS } = require("./common.js");

module.exports = function(source){
  const callback = this.async();
  const { dir, base } = Path.parse(this.resourcePath);
  const chunk = base.split('.');
  const locale = chunk[0];
  const data = JSON.parse(source);
  const files = FS.readdirSync(resolve()).filter(v => v.includes(locale));
  let updated = 0;

  for(const k in data){
    if(k.startsWith("$") || k.startsWith("@")){
      continue;
    }
    const target = resolve(`${locale}.${k}.js`);
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
    FS.unlinkSync(resolve(v));
  }
  console.info("[LANG] Application", `${updated} updated`, `${files.length} removed`);
  if(this.mode === "development"){
    HTTPS.get({
      hostname: "localhost",
      port: SETTINGS['port'],
      path: "/janus/load-languages",
      rejectUnauthorized: false
    }).on('error', err => {
      console.warn("[LANG]", err);
    }).on('close', () => {
      console.info("[LANG] load-languages");
      callback(null, "{}");
    });
  }else{
    callback(null, "{}");
  }
  function resolve(...path){
    return Path.resolve(dir, "..", "..", "dist", "strings", ...path);
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