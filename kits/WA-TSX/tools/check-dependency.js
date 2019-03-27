const FS = require("fs");
const Path = require("path");
const DepTree = require("dependency-tree");

const FILE = Path.resolve(__dirname, `../${process.argv[2]}`);
const DIRECTORY = Path.resolve(__dirname, "../src");

const tree = DepTree({
  filename: FILE,
  directory: DIRECTORY,
  filter: path => path.indexOf("node_modules") === -1
});

FS.writeFileSync(Path.resolve(__dirname, "../dist/dependency-tree.log"), JSON.stringify(toRelativePath(tree), null, 2));

function toRelativePath(tree){
  const R = {};

  for(const [ k, v ] of Object.entries(tree)){
    R[Path.relative(DIRECTORY, k).replace(/\\/g, "/")] = toRelativePath(v);
  }
  return R;
}