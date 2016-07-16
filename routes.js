'use strict';

var express   = require('express');
var mongojs   = require('mongojs');

var envConfig = require('./environment-config');

var router = express.Router();

// setup mongoDB with password sourced from environment variable
var mongoLoginString = envConfig.get('MONGO_USERNAME') + ':' + envConfig.get('MONGO_PASS') + '@' + envConfig.get('MONGO_SUBDOMAIN') + '.mongolab.com:' + envConfig.get('MONGO_PORT') + '/' + envConfig.get('MONGO_USERNAME') + '?authMechanism=SCRAM-SHA-1';
var collection = envConfig.get('MONGO_COLLECTION');
var mongoCollection  = [];
mongoCollection.push(collection);
var db = mongojs(mongoLoginString, mongoCollection, {authMechanism: 'ScramSHA1'});

function serveApp(response) {
  response.append('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.sendfile('index.html');
}

function queryDB(response, queryObject) {
  db[collection].findOne(queryObject, (err, doc) => {
    if (doc) {
      response.json(doc);
    } else {
      response.status(404).json({ error: 'cranyon with ID ' + queryObject.id + ' not found!' });
    }
  });
}

router.get('/cranyons/id/:id', (req, res) => {
  const requestedCranyonId = req.params.id;

  const queryObject = { id: requestedCranyonId };
  queryDB(res, queryObject);
});

router.get('/cranyons/name/:name', (req, res) => {
  let requestedCranyonName = req.params.name;
  requestedCranyonName = requestedCranyonName.toLowerCase();

  const queryObject = { url: requestedCranyonName };

  queryDB(res, queryObject);
});

router.get('/:url', (req, res) => {
  serveApp(res);
})  

router.get('/', (req, res) => {
  serveApp(res);
})

module.exports = router;