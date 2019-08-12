import Express = require("express");
import Spdy = require("spdy");
import Logger from "jj-log";

import DB from "./utils/Database";
import ExpressAgent from "./utils/ExpressAgent";
import { loadLanguages } from "./utils/Language";
import Route from "./utils/Route";
import { DEVELOPMENT, getProjectData, loadEndpoints, SETTINGS } from "./utils/System";

const SPDY_OPTIONS:Spdy.server.ServerOptions = SETTINGS['https'] ? {
  key: getProjectData(SETTINGS['https']['key']),
  cert: getProjectData(SETTINGS['https']['cert'])
} : null;
const App = Express();

if(DEVELOPMENT){
  Logger.warn("Development");
}
loadLanguages();
loadEndpoints();
DB.initialize().then(() => {
  ExpressAgent(App);
  Route(App);
  if(SPDY_OPTIONS){
    Spdy.createServer(SPDY_OPTIONS, App).listen(SETTINGS['port'], () => {
      Logger.success("HTTPS Server", SETTINGS['port']);
    });
  }else{
    App.listen(SETTINGS['port'], () => {
      Logger.success("HTTP Server", SETTINGS['port']);
    });
  }
});
process.on('unhandledRejection', (err:Error) => {
  Logger.error("Unhandled promise rejection", err.stack);
});