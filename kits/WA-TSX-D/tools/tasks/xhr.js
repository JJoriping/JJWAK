const FS = require("fs");
const { iterateLine, orderByKey, withComma } = require("./common");

const NAME = process.argv[2];
const METHOD = process.argv[3];
const PATH = process.argv[4];

if(!NAME || !METHOD || !PATH){
  console.info("Usage: node xhr.js NAME METHOD PATH");
  process.exit();
}

// dds.xhr.req.d.ts 수정
append("./src/common/xhr.req.d.ts");
// dds.xhr.res.d.ts 수정
append("./src/common/xhr.res.d.ts");
// endpoints.json 수정
FS.readFile("./data/endpoints.json", (_, buffer) => {
  const lines = [];
  let inItems = false;
  let indent;

  FS.writeFileSync("./data/endpoints.json", iterateLine(buffer, v => {
    if(v.includes("\"$items\"")){
      inItems = true;
      indent = v.length - v.trimLeft().length;
      return v;
    }
    if(!inItems){
      return v;
    }
    if(v.trim() === "},"){
      inItems = false;
      lines.push(" ".repeat(indent + 2) + `"${NAME}": [ "${METHOD}", "${PATH}" ]`);
      return [
        ...lines.sort().map((v, i, my) => {
          if(i === my.length - 1){
            if(v.endsWith(',')){
              return v.slice(0, v.length - 1);
            }
          }else{
            if(!v.endsWith(',')){
              return v + ',';
            }
          }
          return v;
        }),
        v
      ];
    }
    lines.push(v);
  }));
});

function append(path){
  const table = {};
  let current;
  let indent;
  let inList = false;

  return FS.writeFileSync(path, iterateLine(FS.readFileSync(path), v => {
    switch(v.trim()){
      case "//@jjwak-auto LIST {":
        inList = true;
        indent = v.length - v.trimLeft().length;
        return v;
      case "//@jjwak-auto LIST }":
        inList = false;
        table[NAME] = [
          " ".repeat(indent) + `'${NAME}': never`
        ];
        return [
          ...Object.entries(table).sort(orderByKey).map(withComma),
          v
        ];
    }
    if(!inList){
      return v;
    }
    const chunk = v.match(new RegExp(`^\\s{${indent}}'([\\w-]+)':`));

    if(chunk){
      current = chunk[1];
      table[current] = [];
    }
    table[current].push(v);
  }));
}