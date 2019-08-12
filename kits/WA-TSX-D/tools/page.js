const FS = require("fs");
const Logger = require("jj-log").default;

const PAGE = process.argv[2];

if(!PAGE){
  Logger.info("Usage: node tools/page.js PAGE");
  process.exit();
}

// 폴더 생성
FS.mkdirSync(`./src/front/${PAGE}`);
// TSX 복사
FS.writeFileSync(
  `./src/front/${PAGE}/index.tsx`,
  FS.readFileSync("./tools/page-template.tsx.proto").toString().replace(/%%PAGE%%/g, PAGE)
);
// SCSS 복사
FS.writeFileSync(
  `./src/front/${PAGE}/style.scss`,
  FS.readFileSync("./tools/page-template.scss.proto").toString().replace(/%%PAGE%%/g, PAGE)
);