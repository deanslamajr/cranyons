const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  entry: [
    './assets/js/app.js'
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        loader: 'ngtemplate!html'
      }
    ]
  },

  output: {
    filename: '[hash].js',
    path: __dirname + '/public/js'
  },
  plugins: [HTMLWebpackPluginConfig]
}