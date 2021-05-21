const FS = require("fs");
const Path = require("path");
const OS = require("os");
const NodeExternals = require("webpack-node-externals");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TSCheckerPlugin = require("fork-ts-checker-webpack-plugin");

const { SETTINGS } = require("./tools/lib/common.js");

const DEVELOPMENT = process.argv[process.argv.indexOf("--mode") + 1] === "development";
const REGEXP_PAGE = /^([A-Z]\w+?)+$/;
const WP_ENTRY = FS.readdirSync(Path.resolve(__dirname, "src/front"))
  .filter(v => REGEXP_PAGE.test(v))
;
const WP_ENTRY_FRONT = WP_ENTRY.reduce((pv, v) => {
  pv[v] = Path.resolve(__dirname, `src/front/${v}/index.tsx`);
  return pv;
}, {});
const WP_ENTRY_STYLE = WP_ENTRY.reduce((pv, v) => {
  pv[v] = Path.resolve(__dirname, `src/front/${v}/style.scss`);
  return pv;
}, {});
const WP_ENTRY_LANG = Object.keys(SETTINGS.languageSupport).reduce((pv, v) => {
  pv[v] = Path.resolve(__dirname, `data/lang/${v}.json`);
  return pv;
}, {});
const ANCESTOR = {
  cache: true,
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: OS.cpus().length - 1,
              poolTimeout: DEVELOPMENT ? Infinity : undefined
            }
          },
          {
            loader: "ts-loader",
            options: {
              happyPackMode: true
            }
          }
        ]
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.json$/i,
        use: "./tools/lib/lang-loader"
      }
    ]
  },
  resolve: {
    extensions: [ ".ts", ".tsx", ".js", ".scss", ".css", ".json" ],
    alias: {
      'back': Path.resolve(__dirname, "src/back"),
      'front': Path.resolve(__dirname, "src/front"),
      'world': Path.resolve(__dirname, "src/world")
    }
  },
  plugins: [
    new TSCheckerPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true
        }
      }
    })
  ]
};

module.exports = [
  {
    ...ANCESTOR,
    name: "front",
    target: "web",
    devtool: DEVELOPMENT ? "inline-source-map" : undefined,
    entry: WP_ENTRY_FRONT,
    output: {
      path: Path.resolve(__dirname, "dist", "pages")
    },
    externals: {
      'cluster': {},
      'crypto': {},
      'fs': {},
      'path': {},
      'process': {},

      'highlightjs': "hljs",
      'msgpack-lite': "msgpack",
      'react': "React",
      'react-dom': "ReactDOM"
    },
    performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  },
  {
    ...ANCESTOR,
    name: "style",
    entry: WP_ENTRY_STYLE,
    output: {
      path: Path.resolve(__dirname, "dist", "pages"),
      filename: "[name].dummy.js"
    },
    plugins: [
      ...ANCESTOR.plugins,
      new CleanWebpackPlugin({
        protectWebpackAssets: false,
        cleanOnceBeforeBuildPatterns: [],
        cleanAfterEveryBuildPatterns: [
          "*.dummy.js"
        ]
      }),
      new MiniCSSExtractPlugin()
    ]
  },
  {
    ...ANCESTOR,
    name: "lang",
    entry: WP_ENTRY_LANG,
    output: {
      path: Path.join(__dirname, "dist", "strings"),
      filename: "[name].dummy.js"
    },
    plugins: [
      ...ANCESTOR.plugins,
      new CleanWebpackPlugin({
        protectWebpackAssets: false,
        cleanOnceBeforeBuildPatterns: [],
        cleanAfterEveryBuildPatterns: [
          "*.dummy.js"
        ]
      })
    ]
  },
  {
    ...ANCESTOR,
    name: "back",
    target: "node",
    devtool: "hidden-source-map",
    entry: Path.resolve(__dirname, "src/back/Main.ts"),
    output: {
      path: Path.join(__dirname, "dist"),
      filename: "Main.js"
    },
    node: {
      __filename: false,
      __dirname: false
    },
    externals: [
      NodeExternals()
    ],
    optimization: {
      minimize: false
    }
  }
];