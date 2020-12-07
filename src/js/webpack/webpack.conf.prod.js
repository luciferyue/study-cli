const path = require("path");
const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { APP_ENV, DEFINE_VALUES } = require("./define");
const packageName = require("../package.json").name;

const config = new webpackMerge(baseConfig, {
  entry: ["./src/index.js"],
  mode: "production",
  output: {
    path: path.join(__dirname, "..", "dist", APP_ENV === "production" ? "product" : APP_ENV),
    publicPath: DEFINE_VALUES.APP_URL,
    chunkFilename: "[name].[contenthash:8].js",
    filename: "[name].[contenthash:8].js",
    library: `${packageName}-[name]`,
    libraryTarget: "umd",
    jsonpFunction: `webpackJsonp_${packageName}`,
  },
  module: require("./loaders"),
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      maxSize: 0,
      minChunks: 3,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        vendors: {
          name: "vendor",
          minChunks: 5,
          test: /[\\/]node_modules[\\/]/,
          priority: -20,
        },
      },
    },
    runtimeChunk: {
      name: "manifest",
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          output: {
            comments: false,
          },
          compress: {
            drop_console: true,
          },
          safari10: true,
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: getWebpackPlugins(),
});

function getWebpackPlugins() {
  const plugins = [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:8].css",
      chunkFilename: "[name].[contenthash:8].css",
    }),
    // new HappyPack({
    //   id: "happyBabel",
    //   loaders: [
    //     {
    //       loader: "babel-loader?cacheDirectory=true",
    //     },
    //   ],
    //   threadPool: happyThreadPool,
    //   verbose: true,
    // }),
    // new BundleAnalyzerPlugin({
    // 	analyzerMode: "static"
    // })
  ];
  return plugins;
}

module.exports = config;
