const FS = require("fs");

const REGEXP_ORDER_PRIORITY = /^\$/;

exports.iterateLine = function(buffer, iterator){
  const lines = buffer.toString().split(/\r?\n/g);
  const newLines = [];
  
  for(let i = 0; i < lines.length; i++){
    const R = iterator(lines[i], i, lines);

    if(R === undefined){
      continue;
    }
    if(R instanceof Array){
      newLines.push(...R);
    }else{
      newLines.push(R);
    }
  }
  return newLines.join('\r\n');
};
exports.orderByKey = function([ a ], [ b ]){
  return a.replace(REGEXP_ORDER_PRIORITY, "__").localeCompare(b.replace(REGEXP_ORDER_PRIORITY, "__"));
};
exports.withComma = function([ , v ], i, my){
  let R = v.join('\r\n');

  if(i === my.length - 1){
    if(R.endsWith(',')){
      R = R.slice(0, R.length - 1);
    }
  }else{
    if(!R.endsWith(',')){
      R += ',';
    }
  }
  return R;
}
exports.addToDataJSON = function(path, name, ...contents){
  const table = {};
  let current;
  let indent = 0;

  FS.writeFileSync(path, exports.iterateLine(FS.readFileSync(path), (v, i) => {
    if(v === "{"){
      return v;
    }
    if(v === "}"){
      table[name] = contents.map(v => " ".repeat(indent) + v);
      return [
        ...Object.entries(table).sort(exports.orderByKey).map(exports.withComma),
        "}"
      ];
    }
    const chunk = v.match(/^(\s+)"([$@\w-]+)": (?:\{|\[)(\},?|\],?|$)/);

    if(!current && chunk){
      indent = chunk[1].length;
      if(chunk[3]){
        table[chunk[2]] = [ v ];
        return;
      }else{
        current = chunk[2];
        table[current] = [];
      }
    }
    if(!current){
      throw Error(`불필요한 정보가 들어가 있습니다: #${i}: ${v}`);
    }
    table[current].push(v);
    if(v.startsWith(" ".repeat(indent) + "}") || v.startsWith(" ".repeat(indent) + "]")){
      current = null;
    }
  }));
};