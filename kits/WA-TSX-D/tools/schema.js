const FS = require("fs");
const Path = require("path");
const SchemaGenerator = require("ts-json-schema-generator");

const NAME = process.argv[2];
if(!NAME){
  console.info("Usage: node tools/schema.js NAME");
  process.exit();
}

const type = `Schema.${NAME}`;
const target = Path.resolve(__dirname, "../data", `${NAME.toLowerCase()}.schema.json`);

FS.writeFile(
  target,
  JSON.stringify(SchemaGenerator.createGenerator({
    path: Path.resolve(__dirname, "../src/common/schema.d.ts"),
    type
  }).createSchema(type), null, 2),
  err => {
    if(err){
      throw err;
    }
    console.info("File generated:", target);
  }
);