import Path = require("path");
import Express = require("express");
import BodyParser = require("body-parser");
import CookieParser = require("cookie-parser");

import { SETTINGS } from "./System";
import * as ReactNest from "./ReactNest";
import { getLocale } from "./Language";
import { send404 } from "./Middleware";
import { Logger, LogStyle } from "./Logger";

export default function(App:Express.Application):void{
  // JJWAK 기본
  App.engine("js", ReactNest.Engine);
  App.set('views', Path.resolve(__dirname, "./pages"));
  App.set('view engine', "js");
  App.use("/libs", Express.static(Path.resolve(__dirname, "./libs"), { maxAge: SETTINGS.cookie.age }), send404);
  App.use("/media", Express.static(Path.resolve(__dirname, "./media"), { maxAge: SETTINGS.cookie.age }), send404);
  App.use("/pages", Express.static(Path.resolve(__dirname, "./pages"), { maxAge: SETTINGS.cookie.age }), send404);
  App.use("/strings", Express.static(Path.resolve(__dirname, "./strings"), { maxAge: SETTINGS.cookie.age }), send404);
  App.use("/constants.js", (req, res) => res.sendFile(Path.resolve(__dirname, "./constants.js")));
  App.use("/favicon.ico", (req, res) => res.sendFile(Path.resolve(__dirname, "./favicon.ico")));
  App.use((req, res, next) => {
    req.address = req.ip || req.ips.join();
    if(req.xhr){
      Logger.log().putS(LogStyle.METHOD, req.method).putS(LogStyle.XHR, " XHR")
        .next("URL").put(req.originalUrl)
        .next("Address").put(req.address)
        .out()
      ;
    }else{
      Logger.log().putS(LogStyle.METHOD, req.method)
        .next("URL").put(req.originalUrl)
        .next("Address").put(req.address)
        .out()
      ;
    }
    next();
  });
  App.use(BodyParser.json({ limit: "1MB" }));
  App.use(CookieParser(SETTINGS.cookie.secret));
  App.use((req, res, next) => {
    req.agentInfo = `${req.address} (${req.header('User-Agent')})`;
    req.locale = getLocale(req);
    res.metadata = {};
    res.removeCookie = responseRemoveCookie;
    res.setCookie = responseSetCookie;
    res.header({
      'X-Frame-Options': "deny",
      'X-XSS-Protection': "1;mode=block"
    });
    next(null);
  });
}
function responseRemoveCookie(this:Express.Response, name:string, path:string = "/"):Express.Response{
  return this.clearCookie(name, {
    path: path
  });
}
function responseSetCookie(this:Express.Response, name:string, value:any, path:string = "/"):Express.Response{
  return this.cookie(name, value, {
    path: path,
    maxAge: SETTINGS.cookie.age,
    secure: true
  });
}