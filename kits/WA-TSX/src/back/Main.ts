import Path = require("path");
import Express = require("express");
import CookieParser = require("cookie-parser");
import Spdy = require("spdy");
import Logger from "jj-log";

import ReactNest = require("./utils/ReactNest");
import { getProjectData, SETTINGS } from "./utils/System";

const SPDY_OPTIONS:Spdy.server.ServerOptions = SETTINGS['https'] ? {
  key: getProjectData(SETTINGS['https']['key']),
  cert: getProjectData(SETTINGS['https']['cert'])
} : null;
const App = Express();

App.engine("js", ReactNest.Engine);
App.set('views', Path.resolve(__dirname, "./pages"));
App.set('view engine', "js");

App.use(CookieParser(SETTINGS['cookie-secret']));
App.use("/libs", Express.static(Path.resolve(__dirname, "./libs")));
App.use("/media", Express.static(Path.resolve(__dirname, "./media")));
App.use("/pages", Express.static(Path.resolve(__dirname, "./pages")));

App.get("/gwalli/load-languages", (req, res) => {
  ReactNest.loadLanguages();
  res.sendStatus(200);
});
App.get("/", ReactNest.PageBuilder("Index"));

if(SPDY_OPTIONS){
  Spdy.createServer(SPDY_OPTIONS, App).listen(SETTINGS['port'], () => {
    Logger.success("HTTPS Server", SETTINGS['port']);
  });
}else{
  App.listen(SETTINGS['port'], () => {
    Logger.success("HTTP Server", SETTINGS['port']);
  });
}