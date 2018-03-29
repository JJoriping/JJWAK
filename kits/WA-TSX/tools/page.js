const FS = require("fs");
const JJLog = require("jj-log").default;

const PACKAGE = JSON.parse(FS.readFileSync("./package.json").toString());
const PAGE = process.argv[2];

if(!PAGE){
  JJLog.info("Usage: node tools/page.js PAGE");
  process.exit();
}

// 폴더 생성
FS.mkdirSync(`./src/front/${PAGE}`);
// TSX 복사
FS.writeFileSync(
  `./src/front/${PAGE}/index.tsx`,
  FS.readFileSync("./tools/page-template.tsx").toString().replace(/%%PAGE%%/g, PAGE)
);
// SCSS 복사
FS.writeFileSync(
  `./src/front/${PAGE}/style.scss`,
  FS.readFileSync("./tools/page-template.scss").toString().replace(/%%PAGE%%/g, PAGE)
);
// 언어 파일 변경
for(const v of FS.readdirSync(`./data/lang`)){
  FS.writeFileSync(
    `./data/lang/${v}`,
    attachNewPage(JSON.parse(FS.readFileSync(`./data/lang/${v}`).toString()), PAGE)
  )
}
function attachNewPage(data, page){
  data[page] = {
    title: `${page} - ${PACKAGE['name']}`
  };
  return JSON.stringify(data, null, "  ");
}