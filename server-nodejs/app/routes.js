var url = require('url');
var loginedUser = {
	name: "",
	email: ""
};

module.exports = function(app, db) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {

		if (loginedUser.name !== "") {
			res.cookie('userName', loginedUser.name, { maxAge: 900000, httpOnly: true });
			res.cookie('userEmail', loginedUser.email, { maxAge: 900000, httpOnly: true });
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

			if (userDB) {
				res.write(userDB);
			}

			res.end("");
			return;
		}

		res.render('login.ejs', { message: req.flash('signupMessage') });
	});

	// sended user authorization info
	app.post('/login', function(req, res) {

		// remember loginned user
		loginedUser.name = req.body.name;
		loginedUser.email = req.body.email;

		db.addUser(req.body);

		if (req.cookies.userEmail !== "") {
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