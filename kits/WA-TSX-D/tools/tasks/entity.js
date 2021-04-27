const FS = require("fs");
const { iterateLine } = require("./common");

const NAME = process.argv[2];
const REGEXP_COLUMN = /^\s*`(.+?)` (\w+).*(?:,|\))/gm;
const TYPE_TABLE = {
  'bigint': "number",
  'varchar': "string",
  'int': "number",
  'double': "number",
  'char': "string",
  'tinyint': "number",
  'smallint': "number",
  'text': "string",
  'tinytext': "string",
  'json': "Table<any>",
  'timestamp': "Date",
  'datetime': "Date",
  'binary': "string"
};
let context = "";
let columns = [];

if(!NAME){
  console.info("Usage: node entity.js NAME");
  process.exit();
}

// TS 복사
context = FS.readFileSync("./tools/lib/entity.sql").toString();
for(let chunk = REGEXP_COLUMN.exec(context); chunk; chunk = REGEXP_COLUMN.exec(context)){
  columns.push([
    chunk[1], chunk[2]
  ]);
}
FS.writeFileSync(
  `./src/back/models/${NAME}.ts`,
  FS.readFileSync("./tools/lib/entity-template.ts.proto").toString()
    .replace(/%%NAME%%/g, NAME)
    .replace("%%TABLE%%", context.match(/CREATE TABLE `(.+?)`/)[1])
    .replace("%%COLUMNS%%", columns.map(([ name, type ]) => {
      const R = [];
      const [ camelCasedName, tsType ] = convert(name, type);

      if(context.includes(`PRIMARY KEY (\`${name}\`)`)){
        R.push(`  @TypeORM.PrimaryColumn({ name: "${name}", type: "${type}" })`);
      }else if(name.includes("created_at")){
        R.push(`  @TypeORM.CreateDateColumn({ name: "${name}" })`);
      }else{
        R.push(`  @TypeORM.Column({ name: "${name}", type: "${type}" })`);
      }
      R.push(`  public ${camelCasedName}:${tsType};`);

      return R.join('\n');
    }).join('\n'))
);
// Database.ts 수정
FS.writeFileSync(
  "./src/back/utils/Database.ts",
  append(NAME)
)

function append(name){
  const imports = [ `import ${name} from "back/models/${name}";` ];
  const entities = [ `      ${name}` ];
  let inImport = false;
  let inEntity = false;

  return iterateLine(FS.readFileSync("./src/back/utils/Database.ts"), v => {
    switch(v.trim()){
      case "//@jjwak-auto DB_IMPORT {":
        inImport = true;
        return v;
      case "//@jjwak-auto DB_IMPORT }":
        inImport = false;
        return [ ...imports.sort(), v ];
      case "//@jjwak-auto DB_ENTITY {":
        inEntity = true;
        return v;
      case "//@jjwak-auto DB_ENTITY }":{
        let position;

        inEntity = false;
        entities.sort();
        position = entities.indexOf(`      ${name}`);
        if(position < entities.length - 1){
          entities[position] += ",";
        }
      } return [ ...entities, v ];
    }
    if(inImport){
      imports.push(v);
    }else if(inEntity){
      entities.push(v);
    }else{
      return v;
    }
  });
}
function convert(name, type){
  return [
    name.toLowerCase().split('_').slice(1).map((v, i) => (
      i ? v[0].toUpperCase() + v.slice(1) : v
    )).join(''),
    TYPE_TABLE[type] || type
  ];
}