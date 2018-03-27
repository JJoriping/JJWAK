import FS = require("fs");
import Express = require("express");
import ALP = require("accept-language-parser");
import Logger from "jj-log";

import { getProjectData, SETTINGS } from "./System";

interface ReactNestOptions extends Object{
  page:string;
  title:string;
  locale:string;
}

const HTML_TEMPLATE = getProjectData("template.html").toString();
const LANGUAGE_SUPPORT = SETTINGS['language-support'];
let LANGUAGES:Table<string>;

const READER_TITLE = createReader("TITLE");
const READER_BODY = createReader("BODY");
const READER_REACT_SUFFIX = createReader("REACT_SUFFIX");
const READER_LANGUAGE = createReader("LANGUAGE");
const READER_NEST = /("?)\/\*\{(.+?)\}\*\/\1/g;

function createReader(key:string):RegExp{
  return new RegExp(`("?)/\\* %%${key}%% \\*/\\1`, "g");
}
/**
 * 프로젝트 데이터 폴더 내의 언어 파일을 새로 읽어 문자열표로 가공 후 메모리에 올린다.
 * 
 * 메모리에 올려진 문자열표는 페이지 렌더 시 내용으로 포함된다.
 */
export function loadLanguages():void{
  const prototables = LANGUAGE_SUPPORT.reduce<Table<any>>((pv, v) => {
    pv[v] = JSON.parse(getProjectData(`lang/${v}.json`).toString());
    return pv;
  }, {});
  const R:Table<string> = {};

  for(const locale in prototables){
    const prototable = prototables[locale];
    for(const page in prototable){
      if(page[0] === "$" || page[0] === "@") continue;
      const key = `${locale}/${page}`;
      const table = {
        ...(prototable['$global'] || {}),
        ...prototable[page]
      };
      R[key] = JSON.stringify(table);
      R[`${key}#title`] = table['title'];
    }
  }
  LANGUAGES = R;
  Logger.info("Languages has been updated.");
}
/**
 * 주어진 페이지를 렌더하는 Express 끝점 클로저를 반환한다.
 * 
 * @param page 페이지
 */
export function PageBuilder(page:string):Express.RequestHandler{
  return (req, res) => {
    const locale:string = req.cookies['locale'] || ALP.pick(LANGUAGE_SUPPORT, req.header('Accept-Language'));

    res.render(page, {
      page: page,
      locale: locale
    });
  };
}
/**
 * 주어진 파일에서 정의된 컴포넌트를 최상위 컴포넌트로 삼도록 한 HTML을 전달한다.
 * 
 * HTML 내(JavaScript 포함)에서 `／*{...}*／` 구문은 이 함수 스코프 안에서 `eval(...)` 함수의 결과로 대체된다.
 * 
 * @param path 뷰(React) 파일 경로
 * @param $ Express 관련 추가 정보
 * @param callback 콜백 함수
 */
export function Engine(
  path:string,
  $:ReactNestOptions,
  callback:(err:any, content?:string) => void
):void{
  const REACT_SUFFIX = process.env['NODE_ENV'] === "production"
    ? "production.min"
    : "development"
  ;
  const KEY = `${$.locale}/${$.page}`;
  const LANGUAGE_TABLE_STRING = LANGUAGES[KEY];

  $.title = LANGUAGES[`${KEY}#title`];

  // Express 내부적으로 정의한 정보가 외부에 노출되지 않도록 삭제
  delete ($ as any)['settings'];
  delete ($ as any)['cache'];
  delete ($ as any)['_locals'];

  FS.readFile(path, (err, data) => {
    if(err) return callback(err);
    const HTML = HTML_TEMPLATE
      .replace(READER_REACT_SUFFIX, REACT_SUFFIX)
      .replace(READER_LANGUAGE, LANGUAGE_TABLE_STRING)
      .replace(READER_TITLE, $.title)
      .replace(READER_BODY, data.toString())
      .replace(READER_NEST, (v, p1, p2) => String(eval(p2)))
    ;
    callback(null, HTML);
  });
}
loadLanguages();