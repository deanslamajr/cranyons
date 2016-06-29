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
  }
}