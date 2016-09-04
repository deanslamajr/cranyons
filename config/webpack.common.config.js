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
      }
    ]
  },

  output: {
    filename: '[name]-[hash].js',
    path: __dirname + '/../public/assets'
  }
}