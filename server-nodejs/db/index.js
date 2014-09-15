var fs = require('fs');
var db;


exports.connect = function() {
	db = require('./database');
};

exports.getUser = function(name) {
	if (!db[name]) {
		throw new Error('DB desn\'t contain ' + db[name]);
	}
	return db[name];
};

exports.addUser = function(obj) {
	db[obj.name] = {
		"name" : obj.name,
		"email" : obj.email,
		"password": obj.password
	};

	fs.writeFile(__dirname + '/database.json', JSON.stringify(db, null, 4), function(err) {
		if (err) throw new Error("File wasn't written!");
		console.log("Succeed file saving!");
	});
}