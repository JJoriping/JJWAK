const FS = require("fs");
const JJLog = require("jj-log").default;
const SETTINGS = require("../data/settings.json");
const REQ = SETTINGS['https'] ? require("https") : require("http");

FS.watch("./data/lang", (e, file) => {
  JJLog.info(`%F_CYAN%WATCH%NORMAL% LANG ${file}`);
  REQ.request({
    hostname: "localhost",
    port: SETTINGS['port'],
    path: "/gwalli/load-languages",
    method: "GET",
    rejectUnauthorized: false
  }).on('error', err => {
    JJLog.error(err);
  }).end();
});