const presets = [
  [
    "@babel/preset-env",
    {
      useBuiltIns: "usage",
      corejs: "3",
      targets: {
        chrome: "58",
        ie: "10",
        android: "4.1",
      },
    },
  ],
  "@babel/preset-react",
];

const plugins = ["@babel/transform-runtime", ["@babel/plugin-proposal-decorators", { legacy: true }], ["@babel/plugin-proposal-class-properties", { loose: true }], "@babel/plugin-syntax-dynamic-import", "react-hot-loader/babel"];

module.exports = { presets, plugins };
