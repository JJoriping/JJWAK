import React = require("react");

import { FRONT } from "back/utils/Utility";
import { Icon, IconType } from "front/@block/Icon";
import { getTimeDistance } from "./Utility";

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
let TABLE:Table<string> = FRONT && eval("window.__LANGUAGE");

/**
 * 사용할 문자열표를 설정한다.
 * 
 * 문자열표는 기본적으로 `window.__LANGUAGE` 변수를 참조하지만
 * 이 함수를 이용해 변경할 수 있다.
 * 
 * @param table 새로운 문자열표.
 */
export const setTable = (table:Table<string>) => {
  TABLE = Object.assign({}, table);
};
/**
 * 문자열표를 활용하는 프론트엔드 유틸리티 클래스.
 * 
 * 문자열표의 각 문자열들은 다음 문법을 가질 수 있다.
 * 
 * | 문법 | 이름 | 설명 |
 * |------|------|-----|
 * | `{#n}` | 단일 샤프 인자 | 추가 정보 배열의 인덱스 `n` 요소로 대체된다. |
 * | `{##n}` | 이중 샤프 인자 | 추가 정보 배열의 인덱스 `n` 요소로 대체되며, 요소는 문자열로 처리된다. |
 * | `<{cmd\|arg1\|arg2\|…}>` | 블록 | `PATTERN_RESOLVER`의 키 `cmd`에 대응되는 요소로 대체된다. `arg`*N* 자리에는 문자열 또는 이중 샤프 인자만 들어올 수 있다. |
 */
export default class L{
  private static readonly REGEXP_PATTERN = /<\{(\w+?)(?:\|(.+?))?\}>/g;
  private static readonly REGEXP_ARGS = /\{#(\d+?)\}/g;
  private static readonly REGEXP_STRICT_ARGS = /\{##(\d+?)\}/g;

  /**
   * 문자열표로부터 문자열을 구해 문자열로 반환한다.
   * 
   * 단일 샤프 인자만이 추가 정보로 대체되며 그 외는 무시한다.
   * 
   * @param key 식별자.
   * @param args 추가 정보.
   */
  public static get(key:string, ...args:any[]):string{
    const R:string = TABLE[key];

    if(!R) return `(L#${key})`;
    return R
      .replace(L.REGEXP_PATTERN, "")
      .replace(L.REGEXP_ARGS, (p, v1) => args[v1])
    ;
  }
  /**
   * 문자열표로부터 문자열을 구해 React 컴포넌트로 반환한다.
   * 
   * @param key 식별자.
   * @param args 추가 정보.
   */
  public static render(key:string, ...args:any[]):React.ReactNode{
    if(TABLE[key]){
      return L.parse(TABLE[key], ...args);
    }else{
      return `(L#${key})`;
    }
  }
  private static parse(value:string, ...args:any[]):React.ReactNode{
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
/**
 * 바이트 값을 보기 편한 방식(예: `1.23 KiB`)으로 바꿔 반환한다.
 * 
 * @param bytes 바이트 값.
 */
export const getHumanDigitalSpace = (bytes:number) => {
  if(bytes < 1024) return bytes + " B";
  if(bytes < 1048576) return (bytes / 1024).toFixed(2) + " KiB";
  if(bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MiB";
  return (bytes / 1073741824).toFixed(2) + " GiB";
};
/**
 * 초 값을 `mm:ss` 방식으로 바꿔 반환한다.
 * 
 * @param seconds 초 값.
 */
export const getHumanSeconds = (seconds:number) => (
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`
);
/**
 * 분 값을 보기 편한 방식(예: `1 시간 23 분`)으로 바꿔 반환한다.
 * 
 * @param minutes 분 값.
 */
export const getHumanMinutes = (minutes:number) => {
  if(minutes < 1) return L.get("MINUTES_0");
  minutes = Math.round(minutes);
  if(minutes < 60) return L.get("MINUTES_1", minutes);
  if(minutes < 1440) return L.get("MINUTES_2", Math.floor(minutes / 60), minutes % 60);
  if(minutes < 43800) return L.get("MINUTES_3", Math.floor(minutes / 1440), Math.round(minutes % 1440 / 60));
  return L.get("MINUTES_4", Math.floor(minutes / 43800), Math.round(minutes % 43800 / 1440));
};
/**
 * 수량을 보기 편한 방식(예: `12.3k`)으로 바꿔 반환한다.
 * 
 * @param number 수량 값.
 */
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
/**
 * 시간을 보기 편한 방식(예: `1 시간 23 분 전`)으로 바꿔 반환한다.
 *
 * @param from 출발 UNIX 시각.
 * @param to 도착 UNIX 시각.
 */
export function getHumanTimeDistance(from:number, to:number = Date.now()){
  const distance = getTimeDistance(from, to);

  return distance > -30
    ? L.render("TIME_DISTANCE_PAST", distance)
    : L.render("TIME_DISTANCE_FUTURE", -distance)
  ;
}