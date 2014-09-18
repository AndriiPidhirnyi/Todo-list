var fs = require('fs');
var db;

exports.connect = function() {
	db = require('./database');
};

exports.getUserLoginData = function(email) {
	if (!db[email]) {
		console.log('DB doesn\'t contain ' + db[email]);
		return null;
	}

	var outObj = {};
	outObj.name = db[email].name;
	outObj.email = db[email].email
	outObj.password = db[email].password;

	return outObj;
};

exports.addUser = function(obj) {

	if (db[obj.email] === undefined) {

		db[obj.email] = {
			"name" : obj.name,
			"email" : obj.email,
			"password": obj.password
		};

		fs.writeFile(__dirname + '/database.json', JSON.stringify(db, null, 4), function(err) {
			if (err) throw new Error("File wasn't written!");
			console.log("Succeed file saving!");
		});
	}
};

exports.getUserList = function() {
	var userList = [];

	for (var key in db) {
		userList.push( db[key]["name"] );
	}

	return userList;
}

exports.getUserTasks = function(userEmail) {
	var userTasks = [],
		userTaskProp = db[userEmail]["tasks"];

	for ( var prop in userTaskProp ) {
		userTasks.push( userTaskProp[prop] );
	}

	return userTasks;
}