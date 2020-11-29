const FS = require("fs");
const Path = require("path");
const SASS = require("sass");

const Common = require("./common");

const ROOT = Path.resolve(__dirname, "..");
const PAGE = process.argv[2];
const IS_FOR_PROC = process.argv[3] === "!";

const OPTIONS = {
  file: `./src/front/${PAGE}/style.scss`,
  outFile: `./dist/pages/${PAGE}.css`,
  importer: Common.SASS_IMPORTER
};
const RENDER_GAP = 500;
let changeDetected = false;

if(IS_FOR_PROC){
  console.warn("PRODUCTION MODE!");
  OPTIONS.outputStyle = "compressed";
  SASS.render(OPTIONS, onComplete);
}else{
  SASS.render(OPTIONS, onComplete);
  if(PAGE === "*"){
    console.warn("Development mode doesn't support asterisk.");
  }
  FS.watch("./src/front", { recursive: true }, (c, file) => {
    if(changeDetected) return;
    if(!file.match(/\.scss$/)) return;
    changeDetected = true;
    console.info(`[WATCH] SCSS ${PAGE} (by ${file})`);
    setTimeout(() => {
      Common.flushImporterTable();
      SASS.render(OPTIONS, onComplete);
    }, RENDER_GAP);
  });
}
function onComplete(err, res){
  if(err){
    console.error(err, `${err.file}(${err.line},${err.column})`);
    changeDetected = false;
    return;
  }
  FS.writeFile(OPTIONS.outFile, res.css, err => {
    if(err){
      console.error(err);
      changeDetected = false;
      return;
    }
    let dependencies = Common.getSASSTableEntries()
      .filter(e => e[1].length > 1)
      .sort((a, b) => b[1].length - a[1].length)
    ;
    if(IS_FOR_PROC){
      const baby = [];

      for(const [ k, v ] of dependencies){
        baby.push(toDependencyText([ k, v ]));
        for(const w of v){
          baby.push(`    - ${Path.relative(ROOT, w)}`);
        }
      }
      dependencies = baby;
    }else{
      dependencies = dependencies.slice(0, 5).map(toDependencyText);
    }
    console.info(`${PAGE} at ${res.stats.duration}ms`);
    console.log(dependencies.join('\n'));
    changeDetected = false;
  });
  function toDependencyText([ k, v ]){
    return `{${v.length}} ${Path.relative(ROOT, k)}`;
  }
}