const FS = require("fs");
const Path = require("path");

const TARGET = Path.resolve(__dirname, `../data/lang/${process.argv[2]}.json`);
const LANGUAGE = Object.values(JSON.parse(FS.readFileSync(TARGET))).reduce((pv, v) => Object.assign(pv, v), {});
const REGEXP_CALL = /\.(?:get|render|register)\((\\?"|\\?`)(.+?)\1[,)]/g;
const REGEXP_DETAIL = /\$\{.+?\}/g;
const REGEXP_SELF_CALL = /<\{REF\|(.+?)(?:\}>|\|)/g;
const REGEXP_SELF_DETAIL = /\{##\d+\}/;

for(const [ k, v ] of Object.entries(LANGUAGE).filter(([ k, v ]) => typeof v === "string")){
  for(const chunk of chunks(v, REGEXP_SELF_CALL)){
    const c = chunk[1].match(REGEXP_SELF_DETAIL);
    const pattern = c && new RegExp("^" + chunk[1].replace(REGEXP_SELF_DETAIL, ".+?"));

    if(c) for(const w of Object.keys(LANGUAGE).filter(k => pattern.test(k))){
      delete LANGUAGE[w];
    }else{
      delete LANGUAGE[k];
    }
  }
}
for(const v of [
  "Main.js",
  "World.js",
  ...FS.readdirSync(Path.resolve(__dirname, "../dist/pages")).map(v => `pages/${v}`)
].map(v => FS.readFileSync(Path.resolve(__dirname, `../dist/${v}`)).toString())){
  for(const chunk of chunks(v, REGEXP_CALL)){
    if(chunk[1] === "`"){
      const pattern = new RegExp(chunk[2].replace(REGEXP_DETAIL, ".+?"));

      for(const w of Object.keys(LANGUAGE).filter(k => pattern.test(k))){
        delete LANGUAGE[w];
      }
    }else{
      delete LANGUAGE[chunk[2]];
    }
  }
}
Object.keys(LANGUAGE).forEach((v, i) => {
  console.log(String(i).padStart(5), v);
});
function *chunks(source, pattern){
  const matcher = new RegExp(pattern);
  let chunk = matcher.exec(source);

  while(chunk){
    yield chunk;
    chunk = matcher.exec(source);
  }
}