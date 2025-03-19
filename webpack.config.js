const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const packageJson = require('./package.json')

const dotenv = require("dotenv")

dotenv.config({
  path: 'prod.env'
});

const remotes = {

  sbui: process.env.APP_SBUI
    ? `sbui@${process.env.APP_SBUI}/index.js`
    : `sbui@http://localhost:6061/index.js`,
};

module.exports = {
    output: {
        publicPath: "http://192.168.1.65:4001/admin/",
    },
  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },

  devServer: {
    port: process.env.PORT || 4001, // you can change the port
    https: false,
    historyApiFallback: true,
    open: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    historyApiFallback: {
        index: '/admin/',
    },
    allowedHosts: 'all'
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"]
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      }
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "admin",
      filename: "index.js",
      remotes: remotes,
      exposes: {
        "./main": "./src/App.js",
        "./users-main": "./src/components/user-settings/users/users.jsx",
      },
      shared: packageJson.dependencies
    }),
    new HtmlWebpackPlugin({
      template: "public/index.html", // to import index.html file inside index.js
    }),
  ],
};
