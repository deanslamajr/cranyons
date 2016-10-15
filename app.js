'use strict';

const path        = require('path');

global.appRoot = path.resolve(__dirname);

const express     = require('express');
const bodyParser  = require('body-parser');
const router 	    = require('./server/routes');

const app = express();

app.set('port', (process.env.PORT || 1337))

// to serve local files - for dev only
app.use(express.static(path.join(global.appRoot, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// define routes
app.use(router);

// start the server
app.listen(app.get('port'), function (){
	console.log('ready on port ' + app.get('port'));
});