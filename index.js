const NCP = require("ncp").ncp;
const ReadLine = require("readline-sync");
const JJLog = require("jj-log").default;
const CWD = process.cwd();

function main(){
    JJLog.success("Welcome to JJWAK!");
    // 추후 WA-TSX 키트 외의 다른 키트가 생기게 된다면
    // 이곳에서 키트를 고를 수 있도록 해야 한다.
    const KIT = "WA-TSX";

    // 프로젝트가 이미 존재하는 경우 업데이트(update.js)를 수행해야 한다.

    NCP(`${__dirname}/kits/${KIT}`, CWD, err => {
        if(err) return JJLog.error(err);
        JJLog.success(`The kit ${KIT} has been copied to ${CWD}!`);
        
        JJLog.info("You can use these commands to install and build completely:");
        JJLog.info("\t> npm install");
        JJLog.info("\t> npm run build");
        JJLog.info("\t> npm start");
    });
}
main();