const merge = require('webpack-merge');
const nontest = require('./webpack.nontest.config');

module.exports = merge.smart(nontest, {
  devtool: 'inline-source-map',
});