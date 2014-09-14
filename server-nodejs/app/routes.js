module.exports = function(app, passport) {

	var selected = false;

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {

		if (selected) {
			res.render('index.ejs'); // load the index.ejs file
			return;
		}

		res.redirect("/login");
	});

	// process the login form
	// app.post('/login', do all our passport stuff here);

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('signupMessage') });
	});

	// sended info from user
	app.post('/login', function(req, res) {

		console.log('login page');

		if (req.body.selected == "true") {
			selected = true;
			res.redirect('/');
		}

	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}