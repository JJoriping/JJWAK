# JJWAK v1.4
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
### WA-TAX
- `.\watch-back.cmd [!]`: Watch back-end modules and build
  - The modules are in `./src/back`
  - `!`: build in production mode (no watching)
- `.\watch-front.cmd page [!]`: Watch front-end modules and build
  - The modules are in `./src/front`
  - `page`: the page to be watched. `*` indicates all pages.
  - `!`: build in production mode (no watching)
- `node .\tools\page.js page`: Create a page named `page`
  - It creates a new directory and copy files from:
    - `.\tools\page-template.scss.proto`
    - `.\tools\page-template.tsx.proto`
  - It opens all files in `.\data\lang` and append a field related to the page.
## Kits available
- **NA-TS**: Node.js Application with TypeScript
- **WA-TSX**: Web Application with TypeScript & React
## Modules used
- Babel
- Express
- FontAwesome
- React
- SCSS
- SPDY
- TypeScript
- Webpack
## License
MIT