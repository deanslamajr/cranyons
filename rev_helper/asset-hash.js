'use strict';

var fs = require('fs');

/**
 * Returns the manifest's latest version of that filename, fully qualified with md5 hash
 * @param  {String} filename - the name of the file
 * @return {String}          - the full asset filename with hash
 */
module.exports = function(filename) {
  let manifest = fs.readFileSync('./rev-manifest.json', 'utf-8');
  manifest     = JSON.parse(manifest);

  return manifest[filename] || filename;
};
