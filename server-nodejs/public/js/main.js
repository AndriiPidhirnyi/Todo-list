var app = app || {};

app.clearCache = function() {
	document.cookie = 'userName=' + "";
	document.cookie = 'userEmail=' + "";
}();

app.userbase = new app.UserBase();

app.userView = new app.UserView({});