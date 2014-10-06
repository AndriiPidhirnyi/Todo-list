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
		var tempObj = userTaskProp[prop];
		tempObj.executor = db[userEmail].name;

		userTasks.push( tempObj );
	}

	return userTasks;
};

exports.getOtherUserTasks = function(opts) {
	var userName = opts.userName,
		userEmail = opts.userEmail,
		outObj = [];

	if (opts.isGetOwnTask == "false") {

		for (var user in db) {
			if (db[user].name == userName ) continue;

			for (var task in db[user]["tasks"]) {
				if (db[user]["tasks"][task].author == userName ) {
					var tempObj = db[user]["tasks"][task];
					tempObj.executor = db[user].name;

					outObj.push( tempObj );
				}
			}
		}

	} else {
		for ( var prop in db[userEmail]["tasks"]) {
			outObj.push( db[userEmail]["tasks"][prop] );
		}
	}

	return outObj;
}

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
				author: opts.author,
				isDone: opts.isDone
			}

			db[key]["tasks"][opts.date] = newTaskVer;

			updateDB();

			return;
		}
	}
};

exports.changeDateOfTask = function(opts) {
	for ( var key in db ) {

		if ( db[key].name === opts.executor ) {
			var oldTaskVer = db[key]["tasks"][opts.date],
				newDate = (new Date() ).valueOf() + "";

			var newTaskVer = {
				text: db[key]["tasks"][opts.date].text,
				date: newDate,
				author: db[key]["tasks"][opts.date].author,
				isDone: db[key]["tasks"][opts.date].isDone
			}

			delete db[key]["tasks"][opts.date];

			db[key]["tasks"][newDate] = newTaskVer;

			updateDB();

			return;
		}
	}
}

function updateDB() {
	fs.writeFileSync(__dirname + '/database.json', JSON.stringify(db, null, 4), null,function(err) {
		if (err) throw new Error("File wasn't written!");
		console.log("Succeed file saving!");
	});
}