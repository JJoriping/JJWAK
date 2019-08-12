const FS = require("fs");
const Logger = require("jj-log").default;

const NAME = process.argv[2];

if(!NAME){
  Logger.info("Usage: node tools/entity.js NAME");
  process.exit();
}

// TS 복사
FS.writeFileSync(
  `./src/back/models/${NAME}.ts`,
  FS.readFileSync("./tools/entity-template.ts.proto").toString().replace(/%%NAME%%/g, NAME)
);
// Database.ts 수정
FS.writeFileSync(
  "./src/back/utils/Database.ts",
  append(NAME)
)

function append(name){
  const lines = FS.readFileSync("./src/back/utils/Database.ts").toString().split(/\r\n/g);

  for(let i = 0; i < lines.length; i++){
    switch(lines[i].trim()){
      case "// AUTO DB-IMPORT":
        lines.splice(i + 1, 0, `import ${name} from "back/models/${name}";`);
        i++;
        break;
      case "// AUTO DB-ENTITY":
        lines.splice(i + 1, 0, `      ${name},`);
        i++;
        break;
    }
  }
  return lines.join("\r\n");
}