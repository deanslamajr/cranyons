const merge = require('webpack-merge');
const common = require('./webpack.common.config');

const DefinePlugin = require('webpack/lib/DefinePlugin');

// Mapping of build-time replacements for DefinePlugin
// Mock values for testing
const replacements =  {
  'DP.PICS_DOMAIN': JSON.stringify({
    "MOBILE": "mobile",
    "MAIN": "main",
    "HIGH": "high"
  }),
  'DP.NOT_FOUND_CRANYON': JSON.stringify('NOT_FOUND_CRANYON'),
  'DP.SYSTEM_ERROR_CRANYON': JSON.stringify('SYSTEM_ERROR_CRANYON'),
  'DP.INITIAL_CRANYON': JSON.stringify('INITIAL_CRANYON')
}

module.exports = merge.smart(common, {
  devtool: 'inline-source-map',

  module: {
    loaders: [
      {
        test:   /\.css$/,
        loader: 'ignore-loader'
      }
    ]
  },

  plugins: [
    new DefinePlugin(replacements)
  ],

  externals: {
    sinon: true
  },
});