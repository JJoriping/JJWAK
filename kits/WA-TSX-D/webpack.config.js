const Path = require("path");
const Common = require("./tools/common");

const IS_FOR_PRODUCTION = process.argv.includes("-p");
const IS_STANDALONE = !process.argv.includes("--py");

module.exports = {
  ...(IS_STANDALONE ? {
    mode: "production",
    entry: Common.WP_ENTRIES,
    output: {
      path: Path.resolve(__dirname, "dist/pages")
    }
  } : {}),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          // NOTE regeneratorRuntime is not defined 오류
          ...(IS_FOR_PRODUCTION ? [{
            loader: "babel-loader"
          }] : []),
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [ ".ts", ".tsx", ".js" ],
    alias: {
      'back': Path.resolve(__dirname, "src/back"),
      'front': Path.resolve(__dirname, "src/front")
    },
  },
  externals: {
    'react': "React",
    'react-dom': "ReactDOM"
  }
};