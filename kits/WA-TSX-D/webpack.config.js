const Path = require("path");
const Common = require("./tools/lib/common");

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