const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssNested = require("postcss-nested");
const postcssPresetEnv = require("postcss-preset-env");
const { APP_ENV } = require("../define");

module.exports = {
  test: /\.css$/,
  include: [path.resolve(__dirname, "../../src"), path.resolve(__dirname, "../../node_modules/antg")],
  use: [
    APP_ENV === "local" ? "style-loader" : MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        ident: "postcss",
        plugins: () => [
          postcssNested(),
          postcssPresetEnv({
            stage: 3,
            browsers: ["last 3 versions"],
            features: {
              "nesting-rules": true,
            },
          }),
        ],
      },
    },
  ],
};
