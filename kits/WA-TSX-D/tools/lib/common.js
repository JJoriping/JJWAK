const FS = require("fs");
const Path = require("path");

const REGEXP_PAGE = /^([A-Z]\w+?)+$/;
const SASS_TABLE = {};
const ROOTS = {
  front: Path.resolve(__dirname, "../../src/front")
};

exports.SETTINGS = Object.assign(
  {},
  require("../../data/settings.json"),
  require("../../data/settings.dev.json")
);
exports.WP_ENTRIES = FS.readdirSync(Path.resolve(__dirname, "../../src/front"))
  .filter(v => REGEXP_PAGE.test(v))
  .reduce((pv, v) => {
    pv[v] = Path.resolve(__dirname, `../../src/front/${v}/index.tsx`);
    return pv;
  }, {})
;
exports.SASS_IMPORTER = (url, prev, done) => {
  for(const k in ROOTS){
    const head = k + "/";

    if(url.startsWith(head)){
      url = url.replace(head, ROOTS[k] + Path.sep);
      break;
    }
  }
  const file = Path.resolve(prev, "..", url);
  if(SASS_TABLE.hasOwnProperty(file)){
    SASS_TABLE[file].push(prev);
    done({ contents: "" });
  }else{
    SASS_TABLE[file] = [ prev ];
    done({ file });
  }
};
exports.getSASSTableEntries = () => (
  Object.entries(SASS_TABLE)
);
exports.flushImporterTable = () => {
  for(const k in SASS_TABLE){
    delete SASS_TABLE[k];
  }
};