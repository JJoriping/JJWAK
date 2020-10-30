const FS = require("fs");
const Path = require("path");
const SchemaGenerator = require("ts-json-schema-generator");

const NAME = process.argv[2];
if(!NAME){
  console.info("Usage: node schema.js NAME");
  process.exit();
}

const type = `Schema.${NAME}`;
const target = Path.resolve(__dirname, "../../data", `${NAME.toLowerCase()}.schema.json`);

FS.writeFile(
  target,
  JSON.stringify(SchemaGenerator.createGenerator({
    path: Path.resolve(__dirname, "../../src/**/*.d.ts"),
    tsconfig: Path.resolve(__dirname, "../../tsconfig.json"),
    type,
    skipTypeCheck: true
  }).createSchema(type), null, 2),
  err => {
    if(err){
      throw err;
    }
    console.info("File generated:", target);
  }
);