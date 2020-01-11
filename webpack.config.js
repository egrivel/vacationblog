const path = require('path');

module.exports = {
  entry: [
    '@babel/polyfill',
    './src/boot.js'
  ],
  output: {
    path: __dirname + '/site',
    filename: 'app.js'
  },
  mode: 'development',
  devServer: {
    contentBase: 'site',
    proxy: {
      '/': 'http://localhost/vacationblog/site/'
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        // include: __dirname + '/src/**',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  }
};
