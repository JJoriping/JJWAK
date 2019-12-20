const FS = require("fs");
const ReadLine = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});
const options = {};
const cwd = process.cwd();

console.log("*** JJWAK WA-TSX Setup ***");
console.log("Please introduce your application!", "(Ctrl+C to abort)");
read("Name", cwd.slice(cwd.lastIndexOf("\\") + 1).toLowerCase().replace(/\W/g, "-"))
  .then(() => read("Version", "1.0.0"))
  .then(() => read("Author"))
  .then(() => read("Description"))
  .then(() => read("License", "ISC"))
  .then(() => read("Repository"))
.then(() => {
  const package = JSON.parse(FS.readFileSync("./package.json").toString());

  Object.assign(options, package);

  FS.writeFile("./package.json", JSON.stringify(options, null, "  "), err => {
    if(err) return console.error(err);
    console.info("Setup success");
    process.exit();
  });
});

function read(name, def, field = name.toLowerCase()){
  return new Promise((res, rej) => {
    console.info(`${name}${def ? ` (${def})` : ""}: `);
    process.stdout.write("> ");
    ReadLine.once('line', input => {
      options[field] = input || def || undefined;
      res(input);
    });
  });
}