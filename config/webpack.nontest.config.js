const merge = require('webpack-merge');

const common = require('./webpack.common.config')

// Post CSS Plugins
const cssNext   = require('postcss-cssnext');
const cssImport = require('postcss-import');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Webpack plugins
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');

// App constants
const constants = require('./constants');

// Mapping of build-time replacements for DefinePlugin
const replacements =  {
  'DP.PICS_DOMAIN': JSON.stringify(constants.PICS_DOMAIN),
  'DP.NOT_FOUND_CRANYON': JSON.stringify(constants.NOT_FOUND_CRANYON),
  'DP.SYSTEM_ERROR_CRANYON': JSON.stringify(constants.SYSTEM_ERROR_CRANYON),
  'DP.INITIAL_CRANYON': JSON.stringify(constants.INITIAL_CRANYON)
}

const plugins = [
  new HtmlWebpackPlugin({
    template: __dirname + '/../app/index.ejs',
    filename: '../index.html',
    inject: 'body',
    baseIconURL: JSON.stringify(constants.BASE_ICON_URL),
    domains: JSON.stringify(constants.PICS_DOMAIN),
    initialCranyonPath: constants.INITIAL_CRANYON.image
  }),
  new ExtractTextPlugin('style-[hash].css'),
  new DefinePlugin(replacements)
];

module.exports = merge(common, {
  module: {
    loaders: [
      {
        test:   /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
      }
    ]
  },

  postcss: function (webpack) {
    return [
      cssImport,
      cssNext
    ];
  },

  plugins
});