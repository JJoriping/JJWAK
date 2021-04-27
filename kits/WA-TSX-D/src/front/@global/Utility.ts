import { ReactNode } from "react";

import { FRONT } from "back/utils/Utility";
import { JJWAK } from "common/JJWAK";

/**
 * 현재 페이지 최상위 컴포넌트의 속성 객체.
 */
export const PROPS:JJWAK.Page.Props<JJWAK.Page.Type> = FRONT && eval("window['__PROPS']");

/**
 * HTML 공통 속성 `className`의 값에 적합한 문자열을 반환한다.
 *
 * @param args 클래스 목록. 값이 falsy한 경우 결과에 반영되지 않는다.
 */
export function C(...args:any[]):string{
  return args.filter(Boolean).join(' ');
}
/**
 * 언어에 따른 날짜 문자열을 반환한다.
 *
 * @param value 날짜 정보. 파싱 가능한 날짜 문자열이거나 UNIX 시간이다.
 */
export function getDateText(value:number|string){
  return new Date(value).toLocaleString();
}
/**
 * 백분위를 계산해 반환한다.
 *
 * 최솟값과 최댓값이 같은 경우 0을 반환한다.
 *
 * @param value 대상 값.
 * @param prev 최솟값.
 * @param next 최댓값.
 */
export function getPercent(value:number, prev:number, next:number):number{
  return (next - prev) && (value - prev) / (next - prev) * 100;
}
/**
 * 출발 시각과 도착 시각까지의 시간을 분 단위로 반환한다.
 * 
 * @param from 출발 UNIX 시각.
 * @param to 도착 UNIX 시각.
 */
export function getTimeDistance(from:number, to:number = Date.now()){
  return (to - from) / 60000;
}
/**
 * 주어진 문자열의 원하는 부분을 변환 함수로 변환한 결과를 React fragment로 반환한다.
 * 
 * @param target 대상 문자열.
 * @param pattern 검색 패턴.
 * @param mapper 변환 함수.
 */
export function replaceIntoFragments(target:string, pattern:RegExp, mapper:(key:number, ...args:string[]) => ReactNode):ReactNode[]{
  const R:ReactNode[] = [];
  const p = new RegExp(pattern);
  let chunk:RegExpExecArray|null;
  let lastIndex = 0;
  
  while(chunk = p.exec(target)){
    R.push(target.slice(lastIndex, chunk.index), mapper(chunk.index, ...chunk));
    lastIndex = chunk.index + chunk[0].length;
  }
  if(lastIndex < target.length - 1){
    R.push(target.slice(lastIndex));
  }
  return R;
}