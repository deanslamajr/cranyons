// Webpack plugins
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');

// Post CSS Plugins
const cssNext   = require('postcss-cssnext');
const cssImport = require('postcss-import');

// App environment variables
const envConfig = require('./environment-config');

// App constants
const constants = require('./config/constants');

// Mapping of build-time replacements for DefinePlugin
const replacements =  {
  'definePlugin.picDomain': JSON.stringify(envConfig.get('pic_domain')),
  'definePlugin.meta404': JSON.stringify(constants.meta404),
  'definePlugin.meta500': JSON.stringify(constants.meta500),
  'definePlugin.metaInit': JSON.stringify(constants.init)
}

const plugins = [
  new ExtractTextPlugin('style-[hash].css'),
  new HtmlWebpackPlugin({
    template: __dirname + '/assets/index.ejs',
    filename: '../index.ejs',
    inject: 'body'
  }),
  new CommonsChunkPlugin({
    name: 'vendor',
    filename: '[name].[hash].bundle.js',
    minChunks: Infinity
  }),
  new DefinePlugin(replacements)
];

// Production only plugins
if (envConfig.get('NODE_ENV') === 'production') {
  plugins.push(
    new DedupePlugin()
  );
  plugins.push(
    new UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
}

module.exports = {
  entry: {
    app: './assets/js/app.js',
    vendor: [
      'angular',
      'axios',
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
  plugins,
  postcss: function (webpack) {
    return [
      cssImport,
      cssNext
    ];
  }
}