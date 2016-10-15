'use strict';

const express   = require('express');
const mongojs   = require('mongojs');
const path      = require('path');

const envConfig = require('./environment-config');
const helpers = require('./helpers');

const router = express.Router();

// setup mongoDB with password sourced from environment variable
const loginString = envConfig.get('MONGO_USERNAME') + ':' + envConfig.get('MONGO_PASS') + '@' + envConfig.get('MONGO_SUBDOMAIN') + '.mongolab.com:' + envConfig.get('MONGO_PORT') + '/' + envConfig.get('MONGO_USERNAME') + '?authMechanism=SCRAM-SHA-1';
const collection = [ envConfig.get('MONGO_COLLECTION') ];
const db = mongojs(loginString, collection, { authMechanism: 'ScramSHA1' });

function serveApp(response) {
  response.append('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.sendFile(path.join(global.appRoot, 'public', 'index.html'));
}

function queryDB(response, queryObject) {
  return new Promise((resolve, reject) => {
    db[collection].findOne(queryObject, (err, doc) => {
      if (doc) {
        resolve(doc);
      } else {
        reject();
      }
    });
  });
}

function normalizeResponse(dbResponse) {
  return new Promise((resolve, reject) => {
    resolve(dbResponse);
  });
}

router.get('/cranyons/id/:id', (req, res) => {
  const requestedCranyonId = req.params.id;

  const queryObject = { id: requestedCranyonId };
  queryDB(res, queryObject)
    .then(normalizeResponse)
    .then(data => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ error: 'cranyon with ID ' + queryObject.id + ' not found!' });
    });
});

router.get('/cranyons/name/:name', (req, res) => {
  let requestedCranyonName = req.params.name;
  requestedCranyonName = requestedCranyonName.toLowerCase();

  const queryObject = { url: requestedCranyonName };

  queryDB(res, queryObject)
    .then(normalizeResponse)
    .then(data => {
      response.json(data);
    })
    .catch(() => {
      response.status(404).json({ error: 'cranyon with ID ' + queryObject.id + ' not found!' });
    });
});

router.get('/:url', (req, res) => {
  serveApp(res);
})  

router.get('/', (req, res) => {
  serveApp(res);
})

module.exports = router;