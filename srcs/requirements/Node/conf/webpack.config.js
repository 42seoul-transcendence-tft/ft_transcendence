const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
    clean: true,
  },
  plugins: [new HtmlWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: function() {
                  return [require("autoprefixer")];
                }
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  pragma: "MyReact.createElement"
                },
              ],
            ],
          },
        },
      },
    ],
  },
  devtool: "inline-source-map",
  mode: "development",
};
