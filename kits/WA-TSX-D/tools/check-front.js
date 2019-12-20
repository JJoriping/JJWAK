const FS = require("fs");
const Path = require("path");

const { frontDependencies } = require("../package.json");
const PATHS = [
  Path.resolve(__dirname, "../dist/libs"),
  Path.resolve(__dirname, "../dist/logs"),
  Path.resolve(__dirname, "../dist/pages"),
  Path.resolve(__dirname, "../dist/strings")
];

// 폴더 검사
for(const v of PATHS){
  if(!FS.existsSync(v)){
    console.log("Creating", v);
    FS.mkdirSync(v);
  }
}
// 프론트엔드 의존성 검사
for(const [ k, v ] of Object.entries(frontDependencies)){
  const path = Path.resolve(__dirname, `../dist/libs/${k}`);
  const dest = `../../node_modules/${v}`;

  tryLink(path, dest, "dir");
}
function tryLink(path, dest, type){
  try{
    FS.readlinkSync(path);
    console.log("Already linked:", v);
  }catch(e){
    if(FS.existsSync(path)){
      FS.unlinkSync(path);
    }
    FS.symlinkSync(dest, path, type);
  }
}
process.exit();