import React = require("react");

import { Icon, IconType } from "front/@block/Icon";

type PatternResolver = (key:number, ...args:string[]) => React.ReactNode;

const PATTERN_RESOLVER:Table<PatternResolver> = {
  'BR': key => <br key={key} />,
  'FA': (key, name) => <Icon key={key} name={name} />,
  'FAK': (key, ...args) => <Icon key={key} name={args.join(',')} type={IconType.STACK} />,
  'L': (key, className, data) => <label key={key} className={className}>{data}</label>,
  'ICON': (key, name) => <Icon key={key} className="language" name={name} type={IconType.PURE} />,
  'REF': (key, name, ...args) => <React.Fragment key={key}>{L.render(name, ...args)}</React.Fragment>,

  'HUMAN_D': (key, data) => <React.Fragment key={key}>{getHumanDigitalSpace(Number(data))}</React.Fragment>,
  'HUMAN_M': (key, data) => <React.Fragment key={key}>{getHumanMinutes(Number(data))}</React.Fragment>,
  'HUMAN_N': (key, data) => <React.Fragment key={key}>{getHumanNumber(Number(data))}</React.Fragment>,
};
let TABLE:Table<string> = "/*{'window.__LANGUAGE'}*/" as any;

export const setTable = (table:Table<string>) => {
  TABLE = { ...table };
};
export default class L{
  private static readonly REGEXP_PATTERN = /<\{(\w+?)(?:\|(.+?))?\}>/g;
  private static readonly REGEXP_ARGS = /\{#(\d+?)\}/g;
  private static readonly REGEXP_STRICT_ARGS = /\{##(\d+?)\}/g;

  public static get(key:string, ...args:any[]):string{
    const R:string = TABLE[key];

    if(!R) return `(L#${key})`;
    return R
      .replace(L.REGEXP_PATTERN, "")
      .replace(L.REGEXP_ARGS, (p, v1) => args[v1])
    ;
  }
  public static render(key:string, ...args:any[]):React.ReactNode{
    if(TABLE[key]){
      return L.parse(TABLE[key], ...args);
    }else{
      return `(L#${key})`;
    }
  }
  public static parse(value:string, ...args:any[]):React.ReactNode{
    const R:React.ReactNode[] = [];
    const PATTERN:RegExp = new RegExp(L.REGEXP_PATTERN);
    const blockBank:React.ReactNode[] = [];
    let execArray:RegExpExecArray;
    let prevIndex:number = 0;

    value = value.replace(L.REGEXP_STRICT_ARGS, (p, v1) => {
      return args[v1];
    }).replace(L.REGEXP_ARGS, (p, v1) => {
      blockBank.push(args[v1]);
      return "<{__}>";
    });
    while(execArray = PATTERN.exec(value)){
      if(execArray.index - prevIndex > 0){
        R.push(value.slice(prevIndex, execArray.index));
      }
      if(execArray[1] === '__'){
        R.push(blockBank.shift());
      }else{
        R.push(PATTERN_RESOLVER[execArray[1]](R.length, ...(execArray[2] ? execArray[2].split('|') : [])));
      }
      prevIndex = PATTERN.lastIndex;
    }
    if(prevIndex < value.length){
      R.push(value.slice(prevIndex));
    }
    return <>{R}</>;
  }
}
export const getHumanDigitalSpace = (bytes:number) => {
  if(bytes < 1024) return bytes + " B";
  if(bytes < 1048576) return (bytes / 1024).toFixed(2) + " KiB";
  if(bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MiB";
  return (bytes / 1073741824).toFixed(2) + " GiB";
};
export const getHumanSeconds = (seconds:number) => (
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`
);
export const getHumanMinutes = (minutes:number) => {
  if(minutes < 1) return L.get("MINUTES_0");
  minutes = Math.round(minutes);
  if(minutes < 60) return L.get("MINUTES_1", minutes);
  if(minutes < 1440) return L.get("MINUTES_2", Math.floor(minutes / 60), minutes % 60);
  if(minutes < 43800) return L.get("MINUTES_3", Math.floor(minutes / 1440), Math.round(minutes % 1440 / 60));
  return L.get("MINUTES_4", Math.floor(minutes / 43800), Math.round(minutes % 43800 / 1440));
};
export const getHumanNumber = (number:number) => {
  if(number < 1e3) return String(number);
  const exp = Math.floor(number).toString().length;
  const digit = 2 - (exp - 1) % 3;

  if(number < 1e6) return (number * 1e-3).toFixed(digit) + "k";
  if(number < 1e9) return (number * 1e-6).toFixed(digit) + "M";
  if(number < 1e12) return (number * 1e-9).toFixed(digit) + "G";
  if(number < 1e15) return (number * 1e-12).toFixed(digit) + "T";
  return (number * 1e-15).toFixed(0) + "P";
};