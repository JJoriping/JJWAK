const FS = require("fs");
const Path = require("path");

const TARGET = Path.resolve(__dirname, "../data/endpoints.json");
const ENDPOINTS = JSON.parse(FS.readFileSync(TARGET).toString());

const entries = Object.keys(ENDPOINTS['$items']);

delete ENDPOINTS['$items'];
for(const k in ENDPOINTS){
  for(const v of ENDPOINTS[k]){
    const i = entries.indexOf(v);

    if(i !== -1){
      entries.splice(i, 1);
    }
  }
}
if(entries.length){
  console.log(`${entries.length} items are not used!`);
  for(const v of entries){
    console.log(":", v);
  }
}else{
  console.log("Fine.");
}