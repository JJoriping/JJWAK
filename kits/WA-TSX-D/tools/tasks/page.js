const FS = require("fs");
const SETTINGS = require("../../data/settings.json");
const { iterateLine, orderByKey, withComma, addToDataJSON } = require("./common");

const PAGE = process.argv[2];

if(!PAGE){
  console.info("Usage: node page.js PAGE");
  process.exit();
}

// 폴더 생성
FS.mkdirSync(`./src/front/${PAGE}`);
// TSX 복사
FS.writeFileSync(
  `./src/front/${PAGE}/index.tsx`,
  FS.readFileSync("./tools/lib/page-template.tsx.proto").toString().replace(/%%PAGE%%/g, PAGE)
);
// SCSS 복사
FS.writeFileSync(
  `./src/front/${PAGE}/style.scss`,
  FS.readFileSync("./tools/lib/page-template.scss.proto").toString().replace(/%%PAGE%%/g, PAGE)
);
// jjwak.d.ts 수정
FS.readFile("./src/common/jjwak.d.ts", (_, buffer) => {
  const table = {};
  let current;
  let inPage = false;
  let indent = 0;

  FS.writeFileSync("./src/common/jjwak.d.ts", iterateLine(buffer, v => {
    switch(v.trim()){
      case "//@jjwak-auto PAGE {":
        inPage = true;
        indent = v.length - v.trimLeft().length;
        return v;
      case "//@jjwak-auto PAGE }":
        inPage = false;
        table[PAGE] = [
          " ".repeat(indent) + `'${PAGE}': never`
        ];
        return [
          ...Object.entries(table).sort(orderByKey).map(withComma),
          v
        ];
    }
    if(inPage){
      const openChunk = v.match(new RegExp(`^\\s{${indent}}'(\\w+?)':`));
      const closeChunk = v.match(new RegExp(`^\\s{${indent}}\},?$`));

      if(openChunk){
        current = openChunk[1];
        table[current] = [];
      }
      if(current){
        table[current].push(v);
      }
      if(closeChunk){
        current = null;
      }
      return;
    }
    return v;
  }));
});
// 언어 JSON 수정
for(const k in SETTINGS['language-support']){
  addToDataJSON(`./data/lang/${k}.json`, PAGE, `"${PAGE}": {}`);
}
// 끝점 JSON 수정
addToDataJSON("./data/endpoints.json", PAGE, `"${PAGE}": []`);