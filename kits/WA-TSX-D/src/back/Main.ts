import Express from "express";
import https from "https";

import DB from "./utils/Database";
import ExpressAgent from "./utils/ExpressAgent";
import { loadLanguages } from "./utils/Language";
import Route from "./utils/Route";
import {
  DEVELOPMENT,
  getProjectData,
  loadEndpoints,
  SETTINGS,
  writeClientConstants,
} from "./utils/System";
import { Logger } from "./utils/Logger";

const HTTPS_OPTIONS: https.ServerOptions | null = SETTINGS["https"]
  ? {
      key: getProjectData(SETTINGS["https"]["key"]),
      cert: getProjectData(SETTINGS["https"]["cert"]),
    }
  : null;
const App = Express();

if (DEVELOPMENT) {
  Logger.warning("Development").out();
}
DB.initialize().then(() => {
  loadLanguages();
  loadEndpoints();
  writeClientConstants();
  ExpressAgent(App);
  Route(App);
  if (HTTPS_OPTIONS) {
    https.createServer(HTTPS_OPTIONS, App).listen(SETTINGS["port"], () => {
      Logger.success("HTTPS Server").put(SETTINGS["port"]).out();
    });
  } else {
    App.listen(SETTINGS["port"], () => {
      Logger.success("HTTP Server").put(SETTINGS["port"]).out();
    });
  }
});
process.on("unhandledRejection", (err) => {
  const content = err instanceof Error ? err.stack : String(err);

  Logger.error("Unhandled promise rejection").put(content).out();
});
