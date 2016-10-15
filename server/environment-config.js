/**
 * Sets up environment-specific configuration
 * @module config
 * @requires nconf
 */

const path  = require('path');
const nconf = require('nconf');

const config = nconf
  .argv()
  .env('__') // custom delimiter for nested properties
  .file(path.join(global.appRoot, 'server', 'environment.json'));

module.exports = config;