var express     = require('express');
var path 	      = require('path');
var bodyParser  = require('body-parser');
var router 	    = require('./routes');

var app = express();

app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 1337))
app.set('views', path.join(__dirname, 'public'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// define routes
app.use(router);

// start the server
app.listen(app.get('port'), function (){
	console.log('ready on port ' + app.get('port'));
});