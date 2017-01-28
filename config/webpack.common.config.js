const webpack = require('webpack');

module.exports = {
  entry: {
    app: './app/app.js',
    vendor1: [
      'angular'
    ],
    vendor2: [
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
      minChunks: 2, 
      names: ['vendor1', 'vendor2'], 
      filename: '[name]-[hash].js' 
    })
   ],

  output: {
    filename: '[name]-[hash].js',
    path: __dirname + '/../public/assets'
  }
}