/**
 * Sets up environment-specific configuration
 * @module config
 * @requires nconf
 */

const nconf = require('nconf');

const config = nconf
  .argv()
  .env('__') // custom delimiter for nested properties
  .file(`${__dirname}/config/environment.json`);

module.exports = config;