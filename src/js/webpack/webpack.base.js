const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DEFINE_VALUES } = require("./define");

const config = {
  stats: {
    modules: false,
    performance: false,
    timings: true,
    children: false,
    warnings: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "",
      template: "./static/index.html.ejs",
    }),
    new webpack.DefinePlugin({
      ...DEFINE_VALUES,
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV !== "local" ? "production" : process.env.NODE_ENV),
      },
    }),
  ],
  resolve: {
    alias: {
      "@src": path.join(__dirname, "..", "src"),
      "@common": path.join(__dirname, "..", "src/components/common"),
      "@context": path.join(__dirname, "..", "src/components/frame/container/context.js"),
      "@hooks": path.join(__dirname, "..", "src/hooks/index.js"),
      "@deploySettings": path.join(__dirname, "..", "src/components/deploy/settings"),
      "@deployBase": path.join(__dirname, "..", "src/components/deploy/base"),
      "@actions": path.join(__dirname, "..", "src/actions"),
      "@utils": path.join(__dirname, "..", "src/utils"),
    },
  },
};
module.exports = config;
