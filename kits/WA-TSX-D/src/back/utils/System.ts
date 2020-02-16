import FS = require("fs");
import Path = require("path");

import { TIMEZONE_OFFSET, pick, merge } from "./Utility";
import { Logger } from "./Logger";
import { CLOTHES } from "./Clothes";

/**
 * `data/settings.json` 파일 객체.
 */
export const SETTINGS:Schema.Settings = merge(
  {},
  JSON.parse(getProjectData("settings.json").toString()),
  CLOTHES.development ? JSON.parse(getProjectData("settings.dev.json").toString()) : {}
) as any;
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
  try{
    return FS.readFileSync(Path.resolve(__dirname, `../data/${path}`));
  }catch(e){
    Logger.error().put(e).out();
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
  const data = JSON.stringify(pick(
    SETTINGS.application,
    'language-support'
  ));
  FS.writeFileSync(
    Path.resolve(__dirname, "constants.js"),
    `window.__CLIENT_SETTINGS=${data}`
  );
}