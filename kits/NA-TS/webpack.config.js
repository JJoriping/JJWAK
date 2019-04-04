const Path = require("path");
const NodeExternals = require("webpack-node-externals");

const IS_FOR_PRODUCTION = process.argv.includes("-p");

module.exports = {
  mode: IS_FOR_PRODUCTION ? "production" : "development",
  target: "node",
  entry: Path.resolve(__dirname, "./src/Main.ts"),
  output: {
    path: Path.join(__dirname, "./dist"),
    filename: "Main.js"
  },
  node: {
    __filename: false,
    __dirname: false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
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
    extensions: [ ".ts", ".js" ]
  },
  externals: [
    NodeExternals()
  ]
};