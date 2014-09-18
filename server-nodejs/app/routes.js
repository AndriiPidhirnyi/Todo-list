var url = require('url');
var fs = require('fs');
// read html pages
var pathDir = __dirname + '/../views/';
var indexPage = fs.readFileSync(pathDir + "index.html");
var loginPage = fs.readFileSync(pathDir + "login.html");

var loginedUser = {
	name: "",
	email: ""
};

module.exports = function(app, db) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {

		var params = url.parse(req.url, true).query;

		// request of logged user
		if ( !!params["getLoggedUser"] ) {
			res.end(JSON.stringify(loginedUser));
			return;
		}

		if (loginedUser.name !== "") {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(indexPage);
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
			var userDB = getUserFromDB(params['getUser'], db),
				tempObj = JSON.parse(userDB);

			if (userDB) {
				loginedUser["name"] = tempObj.name;
				loginedUser.email = tempObj.email;
				res.write(userDB);
			}

			res.end("");
			return;
		}

		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(loginPage);
	});

	// sended user authorization info
	app.post('/login', function(req, res) {

		// remember loginned user
		loginedUser.name = req.body.name;
		loginedUser.email = req.body.email;
		console.log("----------------");
		console.log(loginedUser);

		db.addUser(req.body);

		if (req.cookies.userEmail !== "") {
			res.redirect('/');
		}
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		loginedUser.name = "";
		loginedUser.email = "";

		res.redirect('/login');
	});
};

function getUserFromDB(email, database) {
	return database.getUserLoginData(email);
}