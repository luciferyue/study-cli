const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const config = require("./webpack.conf.dev");

new webpackDevServer(webpack(config), {
  publicPath: "/",
  hot: true,
  historyApiFallback: true,
  disableHostCheck: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  },
  // https: true,
  proxy: {
    "/api": {
      target: "https://mapi.igeidao.tech/api/",
      pathRewrite: { "^/api": "/" },
      secure: false,
      changeOrigin: true,
    },
  },
}).listen(8888, "0.0.0.0", (error) => {
  if (error) {
    return console.log(error);
  }

  console.log("test listening at http(s)://ip:8888/");
});
