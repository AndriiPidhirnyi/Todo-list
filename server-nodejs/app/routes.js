var url = require('url');

module.exports = function(app, db) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		if (req.cookies.userName !== '') {
			res.render('index.ejs'); // load the index.ejs file
			return;
		}

		res.redirect("/login");
	});

	// =====================================
	// LOGIN ==============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		var params = url.parse(req.url, true).query;

		if (!!params['getUser']) {
			var userDB = getUserFromDB(params['getUser'], db);

			console.log(userDB);

			if (userDB) {
				res.write(userDB);
			}

			res.end("");
			return;
		}

		res.cookie('userEmail', '');
		res.render('login.ejs', { message: req.flash('signupMessage') });
	});

	// sended info from user
	app.post('/login', function(req, res) {

		if (req.cookies['userEmail'] !== "") {
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

function getUserFromDB(email, database) {
	return database.getUserLoginData(email);
}