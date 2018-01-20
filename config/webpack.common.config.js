const webpack = require('webpack');

module.exports = {
  entry: {
    app: './app/app.js',
    vendor: [
      'angular',
      'angular-animate',
      'axios',
      'babel-polyfill',
      'svgjs'
    ]
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ 
      minChunks: Infinity, 
      name: 'vendor', 
      filename: '[name]-[hash].js' 
    })
   ],

  output: {
    filename: '[name]-[hash].js',
    path: __dirname + '/../public/assets'
  }
}