import Express = require("express");
import Spdy = require("spdy");

import DB from "./utils/Database";
import ExpressAgent from "./utils/ExpressAgent";
import { loadLanguages } from "./utils/Language";
import Route from "./utils/Route";
import { DEVELOPMENT, getProjectData, loadEndpoints, SETTINGS, writeClientConstants } from "./utils/System";
import { Logger } from "./utils/Logger";

const SPDY_OPTIONS:Spdy.server.ServerOptions = SETTINGS['https'] ? {
  key: getProjectData(SETTINGS['https']['key']),
  cert: getProjectData(SETTINGS['https']['cert'])
} : null;
const App = Express();

if(DEVELOPMENT){
  Logger.warning("Development").out();
}
DB.initialize().then(() => {
  loadLanguages();
  loadEndpoints();
  writeClientConstants();
  ExpressAgent(App);
  Route(App);
  if(SPDY_OPTIONS){
    Spdy.createServer(SPDY_OPTIONS, App).listen(SETTINGS['port'], () => {
      Logger.success("HTTPS Server").put(SETTINGS['port']).out();
    });
  }else{
    App.listen(SETTINGS['port'], () => {
      Logger.success("HTTP Server").put(SETTINGS['port']).out();
    });
  }
});
process.on('unhandledRejection', (err:Error) => {
  Logger.error("Unhandled promise rejection").put(err.stack).out();
});