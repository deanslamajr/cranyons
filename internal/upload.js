import fs from 'fs'
import path from 'path'

import AWS from 'aws-sdk'
import s3StreamFactory from 's3-upload-stream'

import env from '../config'

const s3Config = {
  accessKeyId: env.get('S3_ACCESS_KEY_ID'),
  secretAccessKey: env.get('S3_SECRET_ACCESS_KEY'),
  region: env.get('S3_REGION')
}

const s3Stream = s3StreamFactory(new AWS.S3(s3Config))

const frontendWorkingDirectory = path.join(__dirname, '..', 'public', 'assets')

const frontendS3Config = {
  Bucket: env.get('FRONTEND_S3_ASSETS_BUCKET'),
  ACL: 'public-read'
}

const gzipMetaTags = {
  ContentEncoding: 'gzip',
  ContentType: 'text/javascript'
}
const cssMetaTags = {
  ContentType: 'text/css'
}

const tasks = []

/*
 * Frontend files
 */
const frontendFiles = fs.readdirSync(frontendWorkingDirectory)
frontendFiles.forEach(file => {
  if (/\.(gz)/.test(file)) {
    tasks.push(uploadFile(frontendWorkingDirectory, file, { ...frontendS3Config, ...gzipMetaTags }))
  } else if (/\.(css)/.test(file)) {
    tasks.push(uploadFile(frontendWorkingDirectory, file, { ...frontendS3Config, ...cssMetaTags }))
  } else if (
    /favicons/.test(file) ||
    /\.(json)/.test(file) ||
    /(styles.css|styles.css.map)/.test(file)
    ) {
    console.log('skipping:' + file)
  } else {
    tasks.push(uploadFile(frontendWorkingDirectory, file, frontendS3Config))
  }
})

function uploadFile (workingDirectory, filename, extraConfig = {}) {
  let s3Filename = filename
  if (extraConfig.version) {
    console.log('this has a version tag:' + extraConfig.version)
    s3Filename = `${extraConfig.version}-${filename}`
    delete extraConfig.version
  }
  return new Promise((resolve, reject) => {
    const config = Object.assign({ Key: s3Filename }, extraConfig)

    // Create the streams
    const upload = s3Stream.upload(config)

    // Optional configuration
    upload.maxPartSize(20971520) // 20 MB
    upload.concurrentParts(5)

    // Handle errors.
    upload.on('error', (error) => {
      console.log(error)
      reject(error)
    })

    /* Handle upload completion. Example details object:
      { Location: 'https://bucketName.s3.amazonaws.com/filename.ext',
        Bucket: 'bucketName',
        Key: 'filename.ext',
        ETag: '"bf2acbedf84207d696c8da7dbb205b9f-5"' }
    */
    upload.on('uploaded', (details) => {
      console.log(`${s3Filename} was successfully uploaded!`)
      console.dir(details)
      resolve()
    })

    const readStream = fs.createReadStream(path.join(workingDirectory, filename))
    readStream.pipe(upload)
  })
}

Promise.all(tasks)
  .then(() => {
    console.log('All uploads successfully completed! Have a great day')
  })
  .catch(errArray => {
    console.error('There was a problem')
  })
