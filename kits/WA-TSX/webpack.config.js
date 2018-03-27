const Path = require("path");

const IS_FOR_PRODUCTION = process.argv.includes("-p");

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          ...(IS_FOR_PRODUCTION ? [{
            loader: "babel-loader",
            options: {
              presets: [
                "env"
              ]
            }
          }] : []),
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
  externals: {
    'react': "React",
    'react-dom': "ReactDOM"
  }
};