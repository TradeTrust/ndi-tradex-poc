const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");

module.exports = function override(config) {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      new NodePolyfillPlugin({
        includeAliases: ["util", "crypto", "stream", "path", "https", "http"],
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    ],
  };
};
