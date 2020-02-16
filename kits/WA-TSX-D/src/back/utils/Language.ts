import Express = require("express");
import ALP = require("accept-language-parser");

import { SETTINGS, getProjectData } from "./System";
import { reduceToTable, resolveLanguageArguments } from "./Utility";
import { Logger } from "./Logger";

const LANGUAGE_SUPPORT = Object.keys(SETTINGS.application['language-support']);
let LANGUAGES:Table<string>;

/**
 * 문자열표에서 문자열을 얻어 반환한다.
 *
 * @param key 식별자.
 * @param args 추가 정보.
 */
export function L(key:string, ...args:any[]):string{
  return args.length
    ? resolveLanguageArguments(LANGUAGES[key], ...args)
    : LANGUAGES[key]
  ;
}
/**
 * 언어 파일에서 주어진 식별자와 대응되는 문자열표를 반환한다.
 *
 * @param locale 언어 식별자.
 * @param page 페이지 식별자.
 */
export function getLanguageTable(locale:string, page:string):Table<string>{
  return JSON.parse(LANGUAGES[`${locale}/${page}`]);
}
/**
 * 주어진 요청으로부터 사용 가능한 언어를 반환한다.
 *
 * @param req Express 요청 객체.
 */
export function getLocale(req:Express.Request):string{
  let R:string = req.cookies['jjwak.locale'];

  if(!LANGUAGES || !LANGUAGES[R]){
    R = ALP.pick(LANGUAGE_SUPPORT, String(req.headers['accept-language'])) || LANGUAGE_SUPPORT[0];
  }
  return R;
}
/**
 * 프로젝트 데이터 폴더 내의 언어 파일을 새로 읽어 문자열표로 가공 후 메모리에 올린다.
 *
 * 메모리에 올려진 문자열표는 페이지 렌더 시 내용으로 포함된다.
 */
export function loadLanguages():void{
  const prototables = reduceToTable(LANGUAGE_SUPPORT, v => (
    JSON.parse(getProjectData(`lang/${v}.json`).toString()) as Table<Table<string>&{ '$include'?: string[] }>
  ));
  const R:Table<string> = {};

  for(const locale in prototables){
    const prototable = prototables[locale];
    for(const page in prototable){
      if(page[0] === "$" || page[0] === "@") continue;
      const key = `${locale}/${page}`;
      const pageTable = prototable[page] || {};
      const table = {
        ...(prototable['$global'] || {}),
        ...(pageTable['$include'] || []).reduce(resolveDependency, {}),
        ...pageTable
      };
      delete table['$include'];
      R[key] = JSON.stringify(table);
      R[`${key}#title`] = table['title'];
    }
    function resolveDependency(pv:Table<string>, v:string):any{
      const pageTable = prototable[`@${v}`] || {};

      return Object.assign(pv, {
        ...(pageTable['$include'] || []).reduce(resolveDependency, {}),
        ...pageTable
      });
    }
  }
  LANGUAGES = R;
  Logger.info("Languages has been updated.").out();
}