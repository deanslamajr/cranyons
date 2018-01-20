const merge = require('webpack-merge');

const nontest = require('./webpack.nontest.config')

const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const CompressionPlugin = require('compression-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

// App constants
const constants = require('./constants');

module.exports = merge(nontest, {
  output: {
    publicPath: constants.ASSETS_DOMAIN + '/'
  },
  plugins: [
    // emits a json file with assets paths
    new AssetsPlugin(),
    new DedupePlugin(),
    new UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
});