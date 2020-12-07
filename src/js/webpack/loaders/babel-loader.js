const path = require("path");
module.exports = {
  test: /\.([jt])s(x)?$/,
  // exclude: function (modulePath) {
  //   return /node_modules/.test(modulePath) && !/node_modules\/swiper/.test(modulePath) && !/node_modules\/dom7/.test(modulePath);
  // },
  include: [path.resolve(__dirname, "../../src")],
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
    },
  },
};
