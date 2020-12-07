const cssLoader = require("./css-loader");
const babelLoader = require("./babel-loader");
const path = require("path");

module.exports = {
  rules: [
    babelLoader,
    cssLoader,
    {
      test: /\.(png|jpg|gif)$/,
      include: [path.resolve(__dirname, "../../src")],
      use: [
        {
          loader: "file-loader",
          options: {
            limit: 4096,
          },
        },
      ],
    },
  ],
};
