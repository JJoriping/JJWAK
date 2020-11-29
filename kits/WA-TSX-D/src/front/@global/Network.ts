import { CLIENT_SETTINGS, isEmpty } from "back/utils/Utility";

type XHROptions = {
  'method': "GET"|"POST",
  'url': string,
  'data'?: string|ArrayBuffer,
  'headers'?: Table<string>
};
export type XHRResponse<T> = {
  'status': number;
  'result': T;
};
type XHRResultHandler = (status:number, result:any) => void;
type ProgressEventHandler = (e:ProgressEvent, req:XMLHttpRequest) => void;

export function getFormData($form:HTMLFormElement):Table<string>{
  const formData = new FormData($form);
  const R:Table<string> = {};

  for(const [ k, v ] of formData.entries()){
    if(typeof v === "string"){
      R[k] = v;
    }
  }
  return R;
};
export class Cookie{
  private static PARSER:RegExp = /^(.+)=(.*)$/;

  // NOTE SSR을 위해 정적 구간에서 정의하지 않는다.
  private static table:Table<string>;

  private static parseCookies():Table<string>{
    const R:Table<string> = {};
    const data = document.cookie;
    let arr:RegExpMatchArray|null;

    if(!data){
      return R;
    }
    for(const chunk of data.split(';')){
      arr = chunk.trim().match(Cookie.PARSER);
      if(!arr){
        console.warn("Invalid cookie format");
        continue;
      }
      R[arr[1]] = decodeURIComponent(arr[2]);
    }
    return R;
  }
  public static get(name:string):string{
    if(!Cookie.table){
      Cookie.table = Cookie.parseCookies();
    }
    return Cookie.table[name];
  }
  public static set(name:string, value:string):void{
    if(!Cookie.table){
      Cookie.table = Cookie.parseCookies();
    }
    Cookie.table[name] = value;
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  }
}
export class HRef{
  private static PARSER:RegExp = /^(.+)=(.*)$/;

  // NOTE SSR을 위해 정적 구간에서 정의하지 않는다.
  private static table:Table<string>;

  private static parseURL():Table<string>{
    const R:Table<string> = {};
    const data = location.search.slice(1);
    let arr:RegExpMatchArray|null;

    if(!data){
      return R;
    }
    for(const chunk of data.split('&')){
      arr = chunk.trim().match(HRef.PARSER);
      if(!arr){
        console.warn("Invalid URL format");
        continue;
      }
      R[decodeURIComponent(arr[1])] = decodeURIComponent(arr[2]);
    }
    return R;
  }
  public static stringifyURL(concat:Table<any> = {}, noOrigin?:boolean):string{
    if(!HRef.table){
      HRef.table = HRef.parseURL();
    }
    return "?" + Object.entries(noOrigin ? concat : { ...this.table, ...concat })
      .filter(e => e[1] !== undefined)
      .map(([ k, v ]) => {
        return `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`;
      }).join('&')
    ;
  }
  public static get(name:string):string{
    if(!HRef.table){
      HRef.table = HRef.parseURL();
    }
    return HRef.table[name];
  }
}
export class XHR{
  private static readonly REQUEST_URL_TABLE = CLIENT_SETTINGS.endpoints;
  private static readonly REGEXP_ARGS = /\{#(\d+?)\}/g;
  private static table:Table<XHR> = {};
  private static id:number = 0;

  private static send<T extends XHR.Type>(
    options:XHROptions,
    onProgress?:ProgressEventHandler
  ):Promise<XHRResponse<XHR.ResponseTable[T]>>{
    return new Promise((res, rej) => {
      const xhr = new XHR(options, (status, result) => {
        const R:XHRResponse<any> = {
          status,
          result
        };
        let rejected = false;

        if(result && result['error']){
          rejected = true;
          rej(status);
        }else if(!result || status >= 400){
          console.error(status ? "xhr-error" : "xhr-error-0", status ? "high" : "medium", options.url, status);
        }
        if(!rejected) res(R);
        delete XHR.table[xhr.id];
      }, onProgress);
    });
  }
  private static get<T extends XHR.Type>(
    url:string,
    data?:XHR.RequestTable[T],
    onProgress?:ProgressEventHandler
  ):Promise<XHRResponse<XHR.ResponseTable[T]>>{
    if(data && !isEmpty(data)){
      url = url + HRef.stringifyURL(data, true);
    }
    return XHR.send<T>({
      method: "GET",
      url
    }, onProgress);
  }
  private static post<T extends XHR.Type>(
    url:string,
    data?:XHR.RequestTable[T],
    onProgress?:ProgressEventHandler
  ):Promise<XHRResponse<XHR.ResponseTable[T]>>{
    const chunk:any = (data as any) instanceof ArrayBuffer
      ? { data, headers: { 'Content-Type': "application/octet-stream" } }
      : { data: JSON.stringify(data), headers: { 'Content-Type': "application/json;charset=utf-8" } }
    ;
    return XHR.send<T>({
      method: "POST",
      url,
      ...chunk
    }, onProgress);
  }
  public static go<T extends XHR.Type>(
    type:T,
    args?:any[],
    data?:XHR.RequestTable[T],
    onProgress?:ProgressEventHandler
  ):Promise<XHRResponse<XHR.ResponseTable[T]>>{
    if(!XHR.REQUEST_URL_TABLE.hasOwnProperty(type)){
      throw Error(`알 수 없는 유형: ${type}`);
    }
    const [ method, _url ] = XHR.REQUEST_URL_TABLE[type];
    const url = _url.replace(XHR.REGEXP_ARGS, (_, p1) => args[p1]);

    if(method === "GET"){
      return XHR.get(url, data, onProgress);
    }
    return XHR.post(url, data, onProgress);
  }
  public static progressByRate(ontoProgress:(rate:number) => boolean):ProgressEventHandler{
    return (e, req) => {
      if(e.lengthComputable && !ontoProgress(e.loaded / e.total)){
        req.abort();
      }
    };
  }

  private id:number;
  private source:XMLHttpRequest;

  constructor(options:XHROptions, res?:XHRResultHandler, onProgress?:ProgressEventHandler){
    this.id = ++XHR.id;
    this.source = new XMLHttpRequest();
    this.source.open(options.method, options.url, true);
    for(const i in options.headers){
      this.source.setRequestHeader(i, options.headers[i]);
    }
    this.source.addEventListener('readystatechange', this.getOnReadyStateChangeClosure(res));
    onProgress && this.source.upload.addEventListener('progress', e => onProgress(e, this.source));

    this.source.withCredentials = true;
    this.source.setRequestHeader('X-Requested-With', "XMLHttpRequest");
    this.source.send(options.data);

    XHR.table[this.id] = this;
  }
  private getOnReadyStateChangeClosure(res?:XHRResultHandler):() => void{
    return () => {
      if(this.source.readyState !== XMLHttpRequest.DONE) return;
      const contentType = this.source.getResponseHeader('Content-Type');
      let data:string|Table<any> = this.source.response;

      if(contentType?.startsWith("application/json")){
        data = JSON.parse(String(data));
      }
      res?.(this.source.status, data);
    };
  }
}