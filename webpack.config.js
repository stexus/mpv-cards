const path = require("path");
const webpack = require("webpack");

module.exports = {
  // Change to your "entry-point".
  entry: "./src/main",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.bundle.js",
    environment: {
      arrowFunction: false,
      // The environment supports BigInt as literal (123n).
      bigIntLiteral: false,
      // The environment supports const and let for variable declarations.
      const: false,
      // The environment supports destructuring ('{ a, b } = obj').
      destructuring: false,
      // The environment supports an async import() function to import EcmaScript modules.
      dynamicImport: false,
      // The environment supports 'for of' iteration ('for (const x of array) { ... }').
      forOf: false,
      // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
      module: false,
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules\/(?!jstreemap)/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [new webpack.EnvironmentPlugin(["HOME"])],
};
