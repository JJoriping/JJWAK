const Path = require("path");
const ChildProcess = require("child_process");

const { globalDependencies } = require("../package.json");

const NPM_PATH = Path.resolve(
  process.execPath,
  process.platform === "win32" ? "../npm.cmd" : "../npm"
);

// 전역 의존성 검사
const INSTALLED = JSON.parse(
  ChildProcess.spawnSync(NPM_PATH, [ "list", "-g", "--depth=0", "--json" ]
).stdout)['dependencies'];

for(const k in INSTALLED){
  const i = globalDependencies.indexOf(k);

  if(i >= 0){
    console.log("Already installed:", k);
    globalDependencies.splice(i, 1);
  }
}
if(globalDependencies.length > 0){
  console.log("Install global modules...", ...globalDependencies);
  ChildProcess.spawnSync(NPM_PATH, ["install", ...globalDependencies, "-g"]);
}
process.exit();