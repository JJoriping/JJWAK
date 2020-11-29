const FS = require("fs");
const Path = require("path");
const SASS = require("sass");

const Common = require("./lib/common");

async function main(){
  for(const k in Common.WP_ENTRIES){
    try{
      const result = await run(k);

      console.info("SASS", k, `in ${result.stats.duration}ms`);
    }catch(err){
      console.error("SASS", err, `at ${err.file}(${err.line},${err.column})`);
      break;
    }
  }
}
async function run(page){
  console.log(page);

  return new Promise((res, rej) => {
    Common.flushImporterTable();
    SASS.render({
      file: Common.WP_ENTRIES[page].replace(/index\.tsx$/, "style.scss"),
      outputStyle: "compressed",
      importer: Common.SASS_IMPORTER
    }, (err, data) => {
      if(err){
        rej(err);
        return;
      }
      FS.writeFileSync(Path.resolve(__dirname, `../dist/pages/${page}.css`), data.css);
      res(data);
    });
  })
}
main().then(() => {
  console.info("Finished!");
  process.exit();
});