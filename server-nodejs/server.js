// set up =========================================================
// get all the tools we need
var express		= require('express');
var app			= express();
var port		= process.env.PORT || 8080;
var flash		= require('connect-flash');
var db 			= require('./db');
db.connect();

// helpful variables
var morgan		= require('morgan');
var cookieParser= require('cookie-parser');
var session		= require('express-session');

// set up our express application
app.use(morgan('dev'));		// log every request to the console
app.use(cookieParser());	// read cookies (needed for auth)

app.set('view engine', 'ejs');	// set up ejs for templating

// required for passport
app.use( session({secret: 'ilovebeer'}) );	// session secret
app.use( flash() );	// use connect-flash for flash messages stored in session

// routes =========================================================
require('./app/routes.js')(app, db);	// load our routes and pass in pur app
											// fully configured passport

app.use(express.static(__dirname + '/public'));

// launch =========================================================
app.listen(port);
console.log('The magic happens on port ' + port);