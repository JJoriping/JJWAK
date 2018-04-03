const FS = require("fs");
const ReadLine = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});
const JJLog = require("jj-log").default;
const options = {};
const cwd = process.cwd();

JJLog.success("*** JJWAK WA-TSX Setup ***");
JJLog.log("Please introduce your application!", "(Ctrl+C to abort)");
read("Name", cwd.slice(cwd.lastIndexOf("\\") + 1).toLowerCase().replace(/\W/g, "-"))
  .then(() => read("Version", "1.0.0"))
  .then(() => read("Author"))
  .then(() => read("Description"))
  .then(() => read("License", "ISC"))
  .then(() => read("Repository"))
.then(() => {
  const package = JSON.parse(FS.readFileSync("./package.json").toString());
  const bower = JSON.parse(FS.readFileSync("./bower.json").toString());

  Object.assign(options, package);
  bower['name'] = options['name'];
  bower['description'] = options['description'];
  bower['authors'] = [ options['author'] ];
  bower['license'] = options['license'];

  FS.writeFileSync("./bower.json", JSON.stringify(bower, null, "  "));
  FS.writeFile("./package.json", JSON.stringify(options, null, "  "), err => {
    if(err) return JJLog.error(err);
    JJLog.success("Setup");
    process.exit();
  });
});

function read(name, def, field = name.toLowerCase()){
  return new Promise((res, rej) => {
    JJLog.info(`%F_YELLOW%${name}%NORMAL%${def ? ` (${def})` : ""}: `);
    process.stdout.write("> ");
    ReadLine.once('line', input => {
      options[field] = input || def || undefined;
      res(input);
    });
  });
}