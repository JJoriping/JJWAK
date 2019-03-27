# JJWAK v1.3
Integrated Web Application Development Kit for Windows

## Prerequisite
- Node.js 8
- Python 3
- Git
## Setup
1. `npm install -g github:JJoriping/JJWAK`
1. Locate the project you want to start.
1. `jjwak`
1. `npm run settle`
1. `npm start`
## Development
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
- Currently only WA-TSX is supported.
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