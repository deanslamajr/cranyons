/**
 * Sets up environment-specific configuration
 * @module config
 * @requires nconf
 */

const nconf = require('nconf')

const config = nconf
  .argv()
  .env()
  .file(`${__dirname}/../config/environment.json`)

module.exports = config