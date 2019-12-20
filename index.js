const FS = require("fs");
const ChildProcess = require("child_process");
const MD5 = require("md5-file");
const NCP = require("ncp").ncp;
const ReadLine = require("readline-sync");

const CWD = process.cwd();
const EMPTY = `${__dirname}/empty`;
const mergedFiles = [];

function main(){
  let kit;

  console.info("Welcome to JJWAK!");
  console.info(
    "Which kit do you want?\n",
    "(1) NA-TS    for Node.js with TypeScript\n",
    "(2) WA-TSX   for Web with TypeScript & React\n",
    "(3) WA-TSX-D for Web with TypeScript & React including Database"
  );
  switch(ReadLine.questionInt()){
    case 1:
      kit = "NA-TS";
      break;
    case 2:
      kit = "WA-TSX";
      break;
    case 3:
      kit = "WA-TSX-D";
      break;
    default:
      console.error("Type a number above!");
      process.exit();
      return;
  }
  const KIT_PATH = `${__dirname}/kits/${kit}`;

  // 프로젝트가 이미 존재한다면 이전 버전의 JJWAK을 대체한다.
  if(FS.existsSync(`${CWD}/package.json`)){
    console.warn("A project already exists here!");
    if(ReadLine.question("Proceed? (y/n): ") === "y"){
      merge(KIT_PATH);
      console.warn(`Merged file(s): (${mergedFiles.length} total)`, ...mergedFiles);
      console.warn("Please check them all!");
    }else{
      process.exit();
    }
    return;
  }
  // 그렇지 않다면 단순 복사한다.
  NCP(KIT_PATH, CWD, err => {
    if(err) return console.error(err);
    if(!FS.existsSync(`${CWD}/dist`)){
      FS.mkdirSync(`${CWD}/dist`);
    }
    FS.mkdirSync(`${CWD}/dist/libs`);
    console.info(`The kit ${kit} has been copied to ${CWD}!`);
    
    console.info("You can use these commands to install and build completely:");
    console.info("\t> yarn run settle");
    console.info("\t> yarn start");
  });
}
function merge(PATH, sub = ""){
  const dir = `${PATH}${sub}`;

  JJLog.info(`Merging in ${dir}`);
  for(const v of FS.readdirSync(dir)){
    const pathSrc = `${dir}/${v}`;
    const pathDest = `${CWD}${sub}/${v}`;
    let result;

    if(FS.statSync(pathSrc).isDirectory()){
      if(!FS.existsSync(pathDest)){
        console.log(`New directory: ${pathDest}`);
        FS.mkdirSync(pathDest);
      }
      merge(PATH, `${sub}/${v}`);
      continue;
    }
    console.log("Compare two files:", pathSrc, pathDest);
    if(!FS.existsSync(pathDest)){
      console.log(`New file: ${pathDest}`);
      FS.copyFileSync(pathSrc, pathDest);
      continue;
    }
    if(MD5.sync(pathSrc) === MD5.sync(pathDest)) continue;
    result = ChildProcess.spawnSync("git", [
      "merge-file", "-p", pathDest, EMPTY, pathSrc
    ]).stdout;
    FS.writeFileSync(pathDest, result);
    mergedFiles.push(pathDest);
  }
}
main();