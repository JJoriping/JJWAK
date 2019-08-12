import Crypto = require("crypto");
import FS = require("fs");
import Path = require("path");
import Logger from "jj-log";
import { reduceToTable } from "./Utility";

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
export const SETTINGS:JJWAK.Settings = Object.assign(
  {},
  JSON.parse(getProjectData("settings.json").toString()),
  DEVELOPMENT ? JSON.parse(getProjectData("settings.dev.json").toString()) : {}
);
/**
 * `package.json` 파일 객체.
 */
export const PACKAGE:Table<any> = JSON.parse(getProjectData("../package.json").toString());

const PBKDF2_ITER = 121234;
const PBKDF2_LENGTH = 64;
const PBKDF2_METHOD = "sha512";

/**
 * 주어진 문자열을 단방향 암호화하여 반환한다.
 *
 * @param text 암호화할 문자열.
 * @param salt 암호화 솔트 값.
 * @param length 암호화된 문자열 길이.
 */
export function getEncrypted(
  text:string = "",
  salt:string = SETTINGS['crypto-secret'],
  length:number = PBKDF2_LENGTH
):string{
  return Crypto.pbkdf2Sync(text, salt, PBKDF2_ITER, length >> 1, PBKDF2_METHOD).toString("hex");
}
/**
 * 프로젝트 데이터 폴더의 데이터를 동기식으로 읽어 그 내용을 반환한다.
 *
 * @param path 프로젝트 데이터 폴더에서의 하위 경로.
 */
export function getProjectData(path:string):Buffer{
  try{
    return FS.readFileSync(Path.resolve(__dirname, `../data/${path}`));
  }catch(e){
    Logger.error(e);
    return null;
  }
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
 * 임의의 해시를 생성해 반환한다.
 *
 * @param length 암호화된 문자열 길이.
 */
export function getRandomHash(length:number = PBKDF2_LENGTH):string{
  return getEncrypted(String(Math.random()), String(Date.now()), length);
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
 * 주어진 함수가 주기적으로 호출되도록 한다.
 * 
 * @param callback 매번 호출할 함수.
 * @param interval 호출 주기(ms).
 */
export function schedule(callback:(...args:any[]) => void, interval:number):void{
  callback();
  global.setInterval(callback, interval);
}