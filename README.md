# JJWAK v1.7
Cross-platform Integrated Web Application Development Kit

## Prerequisite
- Node.js 8
- Yarn
- Git
## Setup
1. `yarn global add github:JJoriping/JJWAK`
1. Locate the project you want to start.
1. `jjwak`
1. `yarn run settle`
1. `yarn start`
## Development
### WA-TSX-D
- `yarn run build-back`: Build back-end modules
- `yarn run build-front`: Build front-end modules
- `yarn run watch-back`: Watch back-end modules
- `yarn run watch-front page`: Watch a specific front-end page
- `node ./tools/page.js page`: Create a page named `page`
  - It creates a new directory and files from:
    - `./tools/lib/page-template.scss.proto`
    - `./tools/lib/page-template.tsx.proto`
- `node ./tools/entity.js name`: Create an entity named `name`
  - It creates a file from `./tools/lib/entity-template.ts.proto`
  - It modifies the file `./src/back/utils/Database.ts`, especially next to the comments `// AUTO ...`
## Kits available
- **NA-TS**: Node.js Application with TypeScript
- **WA-TSX-D**: Web Application with TypeScript & React including Database Connection Module
## Tools
| Name                        | Explanation |
|-----------------------------|-------------|
| build-scss.js               | is a standalone SCSS transpiling tool. |
| entity.js                   | creates an entity and makes it ready to be used. |
| front.js                    | is a batch of watching front-end stuffs. |
| check-front.js              | checks whether required front-end libraries are available and installs if needed. |
| page.js                     | creates a page and makes it ready to be used. |
| schema.js                   | creates a JSON schema file from a given type described in `Schema.d.ts`. |
| setup.js                    | is an interactive script for setting `package.json`. |
| webpack.back.config.js      | is an internal script for building the back-end modules. |
## Modules used
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