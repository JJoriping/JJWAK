const FS = require("fs");
const SETTINGS = require("../../data/settings.json");
const { iterateLine, orderByKey, withComma, addToDataJSON } = require("./common");

const NAME = process.argv[2];

if(!NAME){
  console.info("Usage: node dialog.js NAME");
  process.exit();
}
const PASCAL_NAME = NAME.split('-').map(v => v[0].toUpperCase() + v.slice(1)).join('');

// TSX 복사
FS.writeFileSync(
  `./src/front/@dialog/${PASCAL_NAME}.tsx`,
  FS.readFileSync("./tools/lib/dialog-template.tsx.proto").toString().replace(/%%NAME%%/g, NAME).replace(/%%PASCAL_NAME%%/g, PASCAL_NAME)
);
// 언어 JSON 수정
for(const k in SETTINGS['language-support']){
  addToDataJSON(`./data/lang/${k}.json`, `@dialog-${NAME}`, `"@dialog-${NAME}": {`, `  "dialog-${NAME}-head": "${PASCAL_NAME}"`, "}");
}
// dds.dialog.d.ts 수정
FS.readFile("./src/common/dds.dialog.d.ts", (_, buffer) => {
  const table = {};
  let inLine = false;
  let current;
  let indent;
  
  FS.writeFileSync("./src/common/dds.dialog.d.ts", iterateLine(buffer, v => {
    switch(v.trim()){
      case "//@jjwak-auto LIST {":
        inLine = true;
        indent = v.length - v.trimLeft().length;
        return v;
      case "//@jjwak-auto LIST }":
        inLine = false;
        table[NAME] = [
          " ".repeat(indent) + `'${NAME}': never`
        ];
        return [
          ...Object.entries(table).sort(orderByKey).map(withComma),
          v
        ];
    }
    if(!inLine){
      return v;
    }
    const chunk = v.match(new RegExp(`^\\s{${indent}}'([\\w-]+?)':`));

    if(chunk){
      current = chunk[1];
      table[current] = [];
    }
    table[current].push(v);
  }));
});