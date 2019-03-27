const FS = require("fs");
const Path = require("path");
const ChildProcess = require("child_process");
const package = require("../package.json");

const REQUIREMENTS = package['globalDependencies'];
const DIST_LIBS = package['frontDependencies'];
const NPM_PATH = Path.resolve(process.execPath, process.platform === "win32" ? "../npm.cmd" : "../npm");

// 전역 의존성 검사
const INSTALLED = JSON.parse(
  ChildProcess.spawnSync(NPM_PATH, [ "list", "-g", "--depth=0", "--json" ]
).stdout)['dependencies'];

for(const k in INSTALLED){
  const i = REQUIREMENTS.indexOf(k);

  if(i >= 0){
    console.log("Already installed:", k);
    REQUIREMENTS.splice(i, 1);
  }
}
if(REQUIREMENTS.length > 0){
  console.log("Install global modules...", ...REQUIREMENTS);
  ChildProcess.spawnSync(NPM_PATH, ["install", ...REQUIREMENTS, "-g"]);
}

// 프론트엔드 의존성 검사
for(const [ k, v ] of Object.entries(DIST_LIBS)){
  const path = Path.resolve(__dirname, `../dist/libs/${k}`);
  const dest = `../../node_modules/${v}`;

  try{
    FS.readlinkSync(path);
    console.log("Already linked:", v);
  }catch(e){
    if(FS.existsSync(path)){
      FS.unlinkSync(path);
    }
    FS.symlinkSync(dest, path, 'dir');
  }
}
process.exit();