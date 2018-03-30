import React = require("react");

type PatternResolver = (key:number, ...args:string[]) => React.ReactNode;

export default class L{
  private static readonly TABLE = (window as any)['__LANGUAGE'];
  private static readonly PATTERN_RESOLVER:Table<PatternResolver> = {
    'BR': key => <br key={key} />
  };

  public static get(key:string, ...args:any[]):string{
    const R:string = L.TABLE[key];

    if(!R) return `(L#${key})`;
    return R.replace(/\{#(\d+?)\}/g, (p, v1) => args[v1]);
  }
  public static render(key:string, ...args:any[]):React.ReactNode{
    const R:React.ReactNode[] = [];
    const PATTERN:RegExp = /\{\{(\w+?)(?:\|(.+?))?\}\}/g;
    let value:string;
    let execArray:RegExpExecArray;
    let prevIndex:number = 0;

    if(!L.TABLE[key]) return `(L#${key})`;
    
    value = L.get(key, ...args);
    while(execArray = PATTERN.exec(value)){
      if(execArray.index - prevIndex > 0){
        R.push(value.slice(prevIndex, execArray.index));
      }
      R.push(L.PATTERN_RESOLVER[execArray[1]](R.length, ...(execArray[2] ? execArray[2].split(',') : [])));
      prevIndex = PATTERN.lastIndex;
    }
    if(prevIndex < value.length){
      R.push(value.slice(prevIndex));
    }
    return R;
  }
}
delete (window as any)['__LANGUAGE'];