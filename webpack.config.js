const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "index.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Minimal WASM"
    })
  ],
  mode: "development"
};
