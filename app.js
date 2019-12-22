'use strict';

const express     = require('express');
const path 	      = require('path');
const bodyParser  = require('body-parser');

const router 	    = require('./routes');

const app = express();

// if in production envs
// only allow https connections
// http://blog.lookfar.com/blog/2017/07/19/how-to-https-all-the-things-in-node/
if (process.env.NODE_ENV === 'production') {
	app.enable('trust proxy');

	app.use(function(req, res, next){
		if (req.header('x-forwarded-proto') !== 'https') {
			res.redirect('https://' + req.header('host') + req.url);
		} else{
			next();
		}
	})
}

app.set('port', (process.env.PORT || 1337))

// to serve local files - for dev only
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// define routes
app.use(router);

// start the server
app.listen(app.get('port'), function (){
	console.log('ready on port ' + app.get('port'));
});