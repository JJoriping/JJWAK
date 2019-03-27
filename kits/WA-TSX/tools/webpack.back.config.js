const Path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  entry: Path.resolve(__dirname, "../src/back/Main.ts"),
  output: {
    path: Path.join(__dirname, "../dist"),
    filename: "Main.js"
  },
  node: {
    __filename: false,
    __dirname: false
  },
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
    extensions: [ ".ts", ".tsx" ],
    alias: {
      'back': Path.resolve(__dirname, "../src/back"),
      'front': Path.resolve(__dirname, "../src/front")
    }
  },
  externals: [
    nodeExternals()
  ]
};