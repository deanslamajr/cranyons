const replace = require('replace-in-file')
const path = require('path')
const values = require('object.values')

const manifest = require('../webpack-assets.json')

const options = {
  // Single file or glob
  files: path.join(__dirname, '..', 'public', 'index.html'),

  // Specify if empty/invalid file paths are allowed (defaults to false)
  // If set to true these paths will fail silently and no error will be thrown.
  allowEmptyPaths: false,

  // Character encoding for reading/writing files (defaults to utf-8)
  encoding: 'utf8'
}

// cheack for Object.values
// @todo if nodeVersion >= 7.0.0 , native support of Object.values negates requirement of this shim
if (!Object.values) {
  values.shim()
}

if (manifest) {
  const javascripts = Object.values(manifest).map(bundlesExports => bundlesExports['js'])

  javascripts.forEach(jsBundle => {
    // @todo handle case where javascripts is an Array
    const bundleSpecificOptions = {
      from: new RegExp(jsBundle),
      to: `${jsBundle}.gz`
    }

    const finalOptions = Object.assign({}, options, bundleSpecificOptions)

    try {
      const changedFiles = replace.sync(finalOptions)
      console.log('Modified files:', changedFiles.join(', '))
    } catch (error) {
      console.error('Error occurred:', error)
    }
  })
}
