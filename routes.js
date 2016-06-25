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

router.get('/', function(req, res) {
  var initialCranyon = envConfig.get('initial_cranyon');
  var picDomain      = envConfig.get('pic_domain');
  var renderObject = {
    basic: true,
    init: initialCranyon,
    picDomain: picDomain,
    notFoundCranyonID: notFoundCranyonID
  }
  res.append('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.render('index', renderObject);
});

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

router.get('/:url', function(req, res) {
  var url = req.params.url.toLowerCase();
  var picDomain = envConfig.get('pic_domain');

  db[collection].findOne({url: url }, function(err, doc) {
    if (doc) {
      sendCranyon(doc);
    } else {
      notFound();
    }
  });

  function sendCranyon(mongoDoc) {
    var renderObject = {
      basic: false,
      init: mongoDoc,
      picDomain: picDomain,
      notFoundCranyonID: notFoundCranyonID
    }
    res.append('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.render('index', renderObject);
  }

  function notFound() {
    var picDomain  = envConfig.get('pic_domain');
    var renderObject = {
      basic: true,
      init: notFoundCranyonID,
      picDomain: picDomain,
      notFoundCranyonID: notFoundCranyonID
    };
    res.status(404);
    res.render('index', renderObject);
  }
})

module.exports = router;