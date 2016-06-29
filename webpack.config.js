const HtmlWebpackPlugin  = require('html-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

const envConfig = require('./environment-config');

const init = {
  basic:              true,
  init:               envConfig.get('initial_cranyon'),
  picDomain:          envConfig.get('pic_domain'),
  notFoundCranyonID:  envConfig.get('notFoundCranyonID'),
  systemErrorID:      envConfig.get('systemErrorID')
}

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/assets/index.ejs',
  filename: '../index.ejs',
  inject: 'body',
  init
});

module.exports = {
  entry: {
    app: [
      './assets/js/app.js'
    ],
    vendor: [
      'angular',
      'lodash',
      'restangular',
      'angular-animate',
      'raphael',
      'imagesloaded'
    ]
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.html$/,
        loader: 'ng-cache'
      }
    ]
  },

  output: {
    filename: '[name]-[hash].js',
    path: __dirname + '/public/js'
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name]-[hash].js',
      minChunks: Infinity
    }),

    HTMLWebpackPluginConfig
  ]
}