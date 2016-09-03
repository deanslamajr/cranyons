const webpackConfig = require('./webpack.test.config');

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: [
      'mocha',
      'chai-sinon',
    ],
    plugins: [
      'karma-mocha',
      'karma-chai-sinon',
      'karma-webpack',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-babel-preprocessor',
      'karma-sourcemap-loader',
    ],
    files: [
      '../node_modules/babel-polyfill/dist/polyfill.js',
      './spec-helper.js',
      '../app/**/*.spec.js',
    ],
    preprocessors: {
      './spec-helper.js': ['webpack'],
      '../app/**/*.spec.js': ['babel'],
      '../app/**/*.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    },
    reporters     : ['nyan'],
    port          : 9876,
    colors        : true,
    logLevel      : config.LOG_INFO,
    browsers      : ['PhantomJS'],
  });
};