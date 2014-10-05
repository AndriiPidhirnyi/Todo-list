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
			"password": obj.password,
			"tasks": {}
		};

		updateDB();
	}
};

exports.getUserList = function() {
	var userList = [];

	for (var key in db) {
		userList.push( db[key]["name"] );
	}

	return userList;
};

exports.getUserByNamePart = function(partName) {
	var suitedName = [],
		regQuery = new RegExp("^" + partName, "i");

	for(var key in db) {
		if (db[key]["name"].search(regQuery) !== -1) suitedName.push( db[key]["name"] );
	}

	return suitedName;
};

exports.getUserTasks = function(userEmail) {
	var userTasks = [],
		userTaskProp = db[userEmail]["tasks"];

	for ( var prop in userTaskProp ) {
		userTasks.push( userTaskProp[prop] );
	}

	return userTasks;
};

exports.addTaskToUser = function(opts) {

	for (var key in db) {

		if (db[key].name === opts.executor ) {
			var taskList = db[key].tasks;

			taskList[opts.date] = {
				text: opts.text,
				author: opts.author,
				date: opts.date,
				isDone: opts.isDone
			};

			updateDB();

			break;
		}
	}
};

exports.removeTask = function(obj) {
	var isSuccess = false;

	if ( db[ obj.userEmail ] && db[ obj.userEmail ].tasks[ obj.date ] ) {
		delete db[ obj.userEmail ].tasks[ obj.date ];
		isSuccess = true;
	}

	updateDB();

	return isSuccess;
};

exports.changeTaskData = function (opts) {

	for ( var key in db ) {

		if ( db[key].name === opts.executor ) {
			var oldTaskVer = db[key]["tasks"][opts.date];

			var newTaskVer = {
				text: opts.text,
				date: opts.date,
				author: oldTaskVer.author,
				isDone: opts.isDone
			}

			db[key]["tasks"][opts.date] = newTaskVer;

			updateDB();

			return;
		}
	}
};

function updateDB() {
	fs.writeFileSync(__dirname + '/database.json', JSON.stringify(db, null, 4), null,function(err) {
		if (err) throw new Error("File wasn't written!");
		console.log("Succeed file saving!");
	});
}