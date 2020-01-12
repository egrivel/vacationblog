// Webpack configuration is not pre-processed by Babel, so it needs
// old require() syntax.

const path = require('path');
const webpack = require('webpack');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'site/'),
    hotOnly: true,
    port: 3000,
    publicPath: 'http://localhost:3000/',
    proxy: {
      '/': 'http://localhost/vacationblog/site/'
    }
  },
  entry: {
    app: './src/boot.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {presets: ['@babel/env']}
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'site/'),
    // publicPath: '/site/',
    filename: 'app.js'
  },
  resolve: {extensions: ['*', '.js', '.jsx']}
};
