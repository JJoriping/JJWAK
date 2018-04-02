const FS = require("fs");
const Path = require("path");
const ChildProcess = require("child_process");

const REQUIREMENTS = [
  "webpack",
  "webpack-cli",
  "typescript",
  "parcel-bundler"
];
const EXEC_PATH = Path.resolve(process.execPath, "../node_modules");
let data;

console.log("Checking global modules...");
for(const v of FS.readdirSync(EXEC_PATH)){
  const i = REQUIREMENTS.indexOf(v);

  if(i !== -1) REQUIREMENTS.splice(i, 1);
}
if(REQUIREMENTS.length > 0){
  console.log("Install global modules...");
  ChildProcess.spawnSync("npm", ["install", ...REQUIREMENTS, "-g"]);
}
process.exit();