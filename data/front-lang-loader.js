const FS = require("fs");
const JJLog = require("jj-log").default;
const HTTPS = require("https");
const SETTINGS = require("./settings.json");

FS.watch("./data/lang", (e, file) => {
  JJLog.info(`%F_CYAN%WATCH%NORMAL% LANG ${file}`);
  HTTPS.request({
    hostname: "localhost",
    port: SETTINGS['port'],
    path: "/gwalli/load-languages",
    method: "GET",
    rejectUnauthorized: false
  }).on('error', err => {
    JJLog.error(err);
  }).end();
});