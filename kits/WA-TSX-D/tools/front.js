const ChildProcess = require("child_process");
const FS = require("fs");
const ReadLine = require("readline");
const Path = require("path");

const STDIO = ReadLine.createInterface(process.stdin, process.stdout);

const page = process.argv[2];
const isProductionMode = page === "!";

console.log("!!!!!!!", "Mode:", isProductionMode ? "Production": "Development");
console.log("!!!!!!!", "Page:", page);

if(isProductionMode){
  const children = [
    attachLANG()
  ];
  let count = 0;

  for(const v of FS.readdirSync(Path.resolve(__dirname, "../src/front"))){
    if(v.startsWith('@')){
      continue;
    }
    if(!FS.statSync(Path.resolve(__dirname, "../src/front", v)).isDirectory()){
      continue;
    }
    console.log("!!!!!!!", "Packing:", v);
    children.push(attachJS(v));
    children.push(attachCSS(v));
  }
  for(const v of children){
    v.on('exit', code => {
      if(code){
        process.exit(code);
      }
      if(++count === children.length){
        process.exit();
      }
    });
  }
}else if(!page){
  console.error("No page specified!");
  process.exit(1);
}else{
  help();

  let $js = attachJS(page);
  let $css = attachCSS(page);
  let $lang = attachLANG();

  STDIO.on('line', line => {
    switch(line){
      case "":
      case "X":
        $js.kill();
        $css.kill();
        $lang.kill();
        process.exit();
      case "Rw":
        $js.kill();
        $js = attachJS(page);
        break;
      case "Rs":
        $css.kill();
        $css = attachCSS(page);
        break;
      case "Rl":
        $lang.kill();
        $lang = attachLANG();
        break;
      default:
        help();
    }
  });
}
function help(){
  console.log("[] [X] Terminate all");
  console.log("[Rw]   Restart JS");
  console.log("[Rs]   Restart CSS");
  console.log("[Rl]   Restart LANG");
}
function attach(name, command, ...args){
  const $baby = ChildProcess.spawn(command, ...args, {
    cwd: Path.resolve(__dirname, ".."),
    shell: true
  });
  $baby.stdout.on('data', chunk => {
    for(const line of String(chunk).split('\n')){
      console.log(`|${name.padEnd(5)}|`, line);
    }
  });
  $baby.stderr.on('data', chunk => {
    for(const line of String(chunk).split('\n')){
      console.error(`|${name.padEnd(5)}|`, line);
    }
  });
  $baby.on('exit', code => {
    console.log("!!!!!!!", `[${name}] exited with the code:`, code);
  });
  return $baby;
}
function attachJS(page){
  return isProductionMode
    ? attach("JS", "webpack", [
      "-p",
      "--entry", `./src/front/${page}/index.tsx`,
      "--output", `./dist/pages/${page}.js`
    ])
    : attach("JS", "webpack", [
      "-w",
      "--mode", "development",
      "--entry", `./src/front/${page}/index.tsx`,
      "--output", `./dist/pages/${page}.js`
    ])
  ;
}
function attachCSS(page){
  return isProductionMode
    ? attach("CSS", "node", [
      "./tools/lib/front-scss-loader.js",
      page,
      "!"
    ])
    : attach("CSS", "node", [
      "./tools/lib/front-scss-loader.js",
      page
    ])
  ;
}
function attachLANG(){
  return isProductionMode
    ? attach("LANG", "node", [
      "./tools/lib/front-lang-loader.js",
      "!"
    ])
    : attach("LANG", "node", [
      "./tools/lib/front-lang-loader.js"
    ])
  ;
}