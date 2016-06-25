'use strict';

/**
 * App config
 * @param  {Object} $compileProvider   
 */
const config = function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
};

config.$inject  = ['$compileProvider'];

export default config;
