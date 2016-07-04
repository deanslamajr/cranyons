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

var notFoundCranyonID = envConfig.get('notFoundCranyonID');
var systemErrorID     = envConfig.get('systemErrorID');

function serveApp(response) {
  response.append('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.render('index');
}

// have two different endpoints /cranyon/id/:id  &  /cranyon/name/:name
router.get('/cranyons/:id', function(req, res) {
  var requestedCranyonId = req.params.id;

  db[collection].findOne({id: requestedCranyonId }, function(err, doc) {
    if (doc) {
      res.json(doc);
    } else {
      res.status(404).json({ error: err });
    }
  });
});

router.get('/:url', (req, res) => {
  serveApp(res);
})  

router.get('/', (req, res) => {
  serveApp(res);
})

module.exports = router;