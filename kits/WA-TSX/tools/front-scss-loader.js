const FS = require("fs");
const SASS = require("node-sass");
const JJLog = require("jj-log").default;
const PAGE = process.argv[2];
const IS_FOR_PROC = process.argv[3] === "!";

const OPTIONS = {
  file: `./src/front/${PAGE}/style.scss`,
  outFile: `./dist/pages/${PAGE}.css`
};
const RENDER_GAP = 500;
let changeDetected = false;

if(IS_FOR_PROC){
  JJLog.warn("PRODUCTION MODE!");
  OPTIONS.outputStyle = "compressed";
  SASS.render(OPTIONS, onComplete);
}else{
  SASS.render(OPTIONS, onComplete);
  if(PAGE === "*"){
    JJLog.warn("Development mode doesn't support asterisk.");
  }
  FS.watch("./src/front", { recursive: true }, (c, file) => {
    if(changeDetected) return;
    if(!file.match(/\.scss$/)) return;
    changeDetected = true;
    JJLog.info(`%F_CYAN%WATCH%NORMAL% SCSS ${PAGE} (by ${file})`);
    setTimeout(() => {
      SASS.render(OPTIONS, onComplete);
    }, RENDER_GAP);
  });
}
function onComplete(err, res){
  if(err){
    JJLog.error(err);
    changeDetected = false;
    return;
  }
  FS.writeFile(OPTIONS.outFile, res.css, err => {
    if(err){
      JJLog.error(err);
      changeDetected = false;
      return;
    }
    JJLog.success(`${PAGE} at ${res.stats.duration}ms`);
    changeDetected = false;
  });
}