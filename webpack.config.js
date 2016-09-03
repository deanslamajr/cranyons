// Webpack plugins
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const CompressionPlugin = require('compression-webpack-plugin');

// Post CSS Plugins
const cssNext   = require('postcss-cssnext');
const cssImport = require('postcss-import');

// App environment variables
const envConfig = require('./environment-config');

// App constants
const constants = require('./config/constants');

// Mapping of build-time replacements for DefinePlugin
const replacements =  {
  'DP.PICS_DOMAIN': JSON.stringify(constants.PICS_DOMAIN),
  'DP.NOT_FOUND_CRANYON': JSON.stringify(constants.NOT_FOUND_CRANYON),
  'DP.SYSTEM_ERROR_CRANYON': JSON.stringify(constants.SYSTEM_ERROR_CRANYON),
  'DP.INITIAL_CRANYON': JSON.stringify(constants.INITIAL_CRANYON)
}

const plugins = [
  new ExtractTextPlugin('style-[hash].css'),
  new HtmlWebpackPlugin({
    template: __dirname + '/app/index.ejs',
    filename: '../index.html',
    inject: 'body',
    baseIconURL: envConfig.get('BASE_ICON_URL'),
    domains: JSON.stringify(constants.PICS_DOMAIN),
    initialCranyonPath: constants.INITIAL_CRANYON.image
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
  plugins.push(
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$/,
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

module.exports = {
  entry: {
    app: './app/app.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
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