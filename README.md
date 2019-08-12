# JJWAK v1.5
Integrated Web Application Development Kit for Windows

## Prerequisite
- Node.js 8
- Yarn
- Python 3
- Git
## Setup
1. `yarn global add github:JJoriping/JJWAK`
1. Locate the project you want to start.
1. `jjwak`
1. `yarn run settle`
1. `yarn start`
## Development
### WA-TSX
- `.\watch-back.cmd [!]`: Watch back-end modules and build
  - The modules are in `./src/back`
  - `!`: build in production mode (no watching)
- `.\watch-front.cmd page [!]`: Watch front-end modules and build
  - The modules are in `./src/front`
  - `page`: the page to be watched. `*` indicates all pages.
  - `!`: build in production mode (no watching)
- `node .\tools\page.js page`: Create a page named `page`
  - It creates a new directory and files from:
    - `.\tools\page-template.scss.proto`
    - `.\tools\page-template.tsx.proto`
### WA-TSX-D
- This includes all features of WA-TSX.
- `node .\tools\entity.js name`: Create an entity named `name`
  - It creates a file from `.\tools\entity-template.ts.proto`
  - It modifies the file `.\src\back\utils\Database.ts`, especially next to the comments `// AUTO ...`
## Kits available
- **NA-TS**: Node.js Application with TypeScript
- **WA-TSX**: Web Application with TypeScript & React
- **WA-TSX-D**: Web Application with TypeScript & React including Database Connection Module
## Tools
| Name                        | Explanation |
|-----------------------------|-------------|
| build-scss.js               | is a standalone SCSS transpiling tool. |
| build.cmd                   | is a batch of building the whole project. |
| check-dependency.js         | reports imports of each file. |
| check-endpoint-reference.js | reports redundant endpoints for each page. |
| check-language-reference.js | reports redundant language strings for each page. |
| common.js                   | is an internal script for the tools. |
| entity-template.ts.proto    | is a TS template for `entity.js`. |
| entity.js                   | creates an entity and makes it ready to be used. |
| front-lang-loader.js        | watches language files and notifies to the server if there occurred a change. |
| front-packer.py             | is a batch of watching front-end stuffs. |
| front-scss-loader.js        | watches SCSS files and transpile automatically if there occurred a change. |
| install-check-global.js     | checks whether required global libraries are available and installs if needed. |
| install.cmd                 | is a batch of preparing to build the project. |
| line-counter.py             | reports some statistics of specified directory. |
| page-template.scss.proto    | is a SCSS template for `page.js`. |
| page-template.tsx.proto     | is a TSX template for `page.js`. |
| page.js                     | creates a page and makes it ready to be used. |
| publish.js                  | uploads some parts of the project to a remote node via SSH. |
| setup.js                    | is an interactive script for setting `package.json`. |
| webpack.back.config.js      | is an internal script for building the back-end modules. |
## Modules used
- Babel
- Express
- FontAwesome
- React
- SCSS
- SPDY
- TypeORM
- TypeScript
- Webpack
## License
MIT