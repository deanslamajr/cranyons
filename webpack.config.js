const HtmlWebpackPlugin  = require('html-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Post CSS Plugins
const cssNext   = require('postcss-cssnext');
const cssImport = require('postcss-import');

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
    app: './assets/js/app.js',
    vendor: [
      'angular',
      'lodash',
      'restangular',
      'angular-animate',
      'raphael',
      'imagesloaded'
    ],
    style: './assets/css/app.css'
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
      },
      {
        test:   /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
      }
    ]
  },

  output: {
    filename: '[name]-[hash].js',
    path: __dirname + '/public/assets'
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name]-[hash].js',
      minChunks: Infinity
    }),

    new ExtractTextPlugin('[hash].css', 
    {
      allChunks: true
    }),

    HTMLWebpackPluginConfig
  ],
  postcss: function (webpack) {
      return [
        cssImport,
        cssNext
      ];
  }
}