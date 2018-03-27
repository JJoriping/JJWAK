# JJWAK
Integrated Web Application Development Kit for Windows
## Version 1.0
- Published on 180327
- The first version :)

## Prerequisite
- Node.js 8
- Python 3
## Setup
1. `npm install`
1. `npm run build`
1. `npm start`
## Development
- `.\watch-back.cmd [!]`: Watch back-end modules and build
  - The modules are in `./src/back`
  - `!`: build in production mode (no watching)
- `.\watch-front.cmd page [!]`: Watch front-end modules and build
  - The modules are in `./src/front`
  - `page`: the page to be watched. `*` indicates all pages.
  - `!`: build in production mode (no watching)
## Modules used
- Babel
- Bower
- Express
- Parcel
- React
- SCSS
- SPDY
- TypeScript
- Webpack
## License
MIT