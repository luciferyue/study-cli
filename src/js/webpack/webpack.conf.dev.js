const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base");
const packageName = require("../package.json").name;
const { DEFINE_VALUES } = require("./define");

const config = new webpackMerge(baseConfig, {
  mode: "development",
  devtool: "inline-source-map",
  stats: "errors-only",
  target: "web",
  entry: {
    app: ["./src/index.js"],
  },
  output: {
    path: path.join(__dirname, "..", "dist", process.env.NODE_ENV),
    filename: "[name].js",
    publicPath: DEFINE_VALUES.APP_URL,
    library: `${packageName}-[name]`,
    libraryTarget: "umd",
    jsonpFunction: `webpackJsonp_${packageName}`,
  },
  module: require("./loaders"),
  plugins: [new webpack.NamedModulesPlugin()],
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
});

module.exports = config;
