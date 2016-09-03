const merge = require('webpack-merge');
const common = require('./webpack.common.config');

module.exports = merge(common, {
  devtool: 'inline-source-map',

  externals: {
    sinon: true
  },
});