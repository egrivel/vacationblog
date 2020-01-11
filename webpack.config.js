module.exports = {
  entry: [
    '@babel/polyfill',
    './src/boot.js'
  ],
  output: {
    path: __dirname + '/site/js',
    filename: 'boot.js'
  },
  mode: 'development',
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
