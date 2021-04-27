import FS from "fs";
import Path from "path";

import { JJWAK } from "common/JJWAK";
import { reduceToTable, TIMEZONE_OFFSET } from "./Utility";
import { Schema } from "common/Schema";

/**
 * 프로젝트 루트 경로.
 */
export const PROJECT_ROOT = Path.resolve(__dirname, "..");
/**
 * 개발 플래그 설정 여부.
 */
export const DEVELOPMENT = process.argv.includes("--dev");
/**
 * `data/endpoints.json` 파일 객체.
 */
export const ENDPOINTS:Table<any> = {};
/**
 * `data/settings.json` 파일 객체.
 */
export const SETTINGS:Schema.Settings = Object.assign(
  {},
  JSON.parse(getProjectData("settings.json").toString()),
  DEVELOPMENT ? JSON.parse(getProjectData("settings.dev.json").toString()) : {}
);
/**
 * `package.json` 파일 객체.
 */
export const PACKAGE:Table<any> = JSON.parse(getProjectData("../package.json").toString());

/**
 * 프로젝트 데이터 폴더의 데이터를 동기식으로 읽어 그 내용을 반환한다.
 *
 * @param path 프로젝트 데이터 폴더에서의 하위 경로.
 */
export function getProjectData(path:string):Buffer{
  return FS.readFileSync(Path.resolve(__dirname, `../data/${path}`));
}
/**
 * 프로젝트 데이터 폴더의 파일에 비동기식으로 내용을 쓴다.
 * 
 * @param path 프로젝트 데이터 폴더에서의 하위 경로.
 * @param data 파일에 쓸 내용.
 */
export function setProjectData(path:string, data:any):Promise<void>{
  return new Promise((res, rej) => {
    FS.writeFile(Path.resolve(__dirname, `../data/${path}`), data, err => {
      if(err){
        rej(err);
        return;
      }
      res();
    });
  });
}
/**
 * 프로젝트 데이터 폴더 내의 종점 파일을 새로 읽어 가공 후 메모리에 올린다.
 * 
 * 메모리에 올려진 문자열표는 페이지 렌더 시 XHR 종점 목록으로 포함된다.
 */
export function loadEndpoints():void{
  const R:Table<any> = {};
  const endpoints:Table<string[]> = JSON.parse(getProjectData("endpoints.json").toString());
  const $items = endpoints['$items'] as Table<any>;
  const $global = reduceToTable(endpoints['$global'], v => $items[v]);
  
  for(const k in endpoints){
    if(k.startsWith("$")){
      continue;
    }
    R[k] = Object.assign({}, $global, reduceToTable(endpoints[k], v => $items[v]));
  }
  Object.assign(ENDPOINTS, R);
}
/**
 * 프로젝트 루트로부터 하위 경로를 구해 반환한다.
 * 
 * @param path 하위 경로 배열.
 */
export function resolve(...path:string[]):string{
  return Path.resolve(PROJECT_ROOT, ...path);
}
/**
 * 주어진 함수가 주기적으로 호출되도록 한다.
 *
 * @param callback 매번 호출할 함수.
 * @param interval 호출 주기(㎳).
 * @param options 설정 객체.
 */
export function schedule(
  callback:(...args:any[]) => void,
  interval:number,
  options?:Partial<JJWAK.ScheduleOptions>
):void{
  if(options?.callAtStart){
    callback();
  }
  if(options?.punctual){
    const now = Date.now() + TIMEZONE_OFFSET;
    const gap = (1 + Math.floor(now / interval)) * interval - now;

    global.setTimeout(() => {
      callback();
      global.setInterval(callback, interval);
    }, gap);
  }else{
    global.setInterval(callback, interval);
  }
}
/**
 * 외부에서 `/constants.js`로 접속할 수 있는 클라이언트 상수 파일을 만든다.
 *
 * 이 파일에는 `data/settings.json` 파일의 `application` 객체 일부가 들어가 있다.
 */
export function writeClientConstants():void{
  const data:Partial<JJWAK.ClientSettings> = {
    'language-support': SETTINGS['language-support']
  };
  FS.writeFileSync(
    resolve("dist", "constants.js"),
    `window.__CLIENT_SETTINGS=${JSON.stringify(data)}`
  );
}