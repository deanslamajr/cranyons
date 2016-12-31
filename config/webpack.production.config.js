const merge = require('webpack-merge');

const nontest = require('./webpack.nontest.config')

const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const CompressionPlugin = require('compression-webpack-plugin');

// App constants
const constants = require('./constants');

module.exports = merge(nontest, {
  output: {
    publicPath: constants.ASSETS_DOMAIN + '/'
  },
  plugins: [
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