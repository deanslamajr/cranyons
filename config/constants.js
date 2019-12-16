/**
 * Sets up environment-specific configuration
 * @module config
 * @requires nconf
 */

import nconf from 'nconf'

const config = nconf
  .argv()
  .env('__') // custom delimiter for nested properties
  .file(`${__dirname}/../config/constants.json`)

export default config