const FS = require("fs");
const Logger = require("jj-log").default;
const SETTINGS = Object.assign(
  {},
  require("../data/settings.json"),
  require("../data/settings.dev.json")
);
const REQ = SETTINGS['https'] ? require("https") : require("http");

FS.watch("./data/lang", (e, file) => {
  Logger.info(`%F_CYAN%WATCH%NORMAL% LANG ${file}`);
  REQ.request({
    hostname: "localhost",
    port: SETTINGS['port'],
    path: "/admin/load-languages",
    method: "GET",
    rejectUnauthorized: false
  }).on('error', err => {
    Logger.error(err);
  }).end();
});