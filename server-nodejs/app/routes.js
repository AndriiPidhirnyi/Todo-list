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
		var resObj = {};
		var isReturnPage = true;

		// request of logged user
		if ( !!params["getLoggedUser"] ) {
			resObj["loggedUser"] = loginedUser;
			isReturnPage = false;
		}

		// get registered user list
		if (!!params["getUserList"]) {
			resObj["usersList"] = db["getUserList"]();
			isReturnPage = false;
		}

		// get user's tasks
		if (!!params["getUserTasks"]) {
			resObj["userTasks"] = db["getUserTasks"]( loginedUser.email );
			isReturnPage = false;
		}

		if ( !isReturnPage ) {
			res.end( JSON.stringify(resObj) );
			return;
		}

		// return index.html page to client browser
		if (loginedUser.name !== "") {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(indexPage);
			return;
		}

		res.redirect("/login");
	});

	app.post('/add-task', function(req, res) {

		var taskObj = {
			text: req.body.text,
			executor: (req.body.executor !== "") ? req.body.executor : loginedUser.name,
			date: req.body.date,
			author: loginedUser.name,
			isDone: req.body.isDone
		};

		db.addTaskToUser( taskObj );
		res.end("");
	});

	app.delete('/remove-task', function(req, res) {
		var isSuccess = db.removeTask( req.body );

		res.write("" + isSuccess);
		res.end("");

	});

	// change task in database
	app.post('/change-task', function(req, res) {

		var changeObj = {
			text: req.body.text,
			executor: req.body.executor,
			date: req.body.date,
			author: loginedUser.name,
			isDone: req.body.isDone
		};

		db.changeTaskData( changeObj );

		res.end("");
	});

	app.get("/user-list", function(req, res) {
		var inpObj = url.parse(req.url, true).query;

		var out = db.getUserByNamePart(inpObj.namePart);
		res.write( JSON.stringify(out) );
		res.end("");
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
	return JSON.stringify( database.getUserLoginData(email) );
}