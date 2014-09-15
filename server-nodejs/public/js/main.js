var app = app || {};

app.userbase = new app.UserBase();

app.userView = new app.UserView({});

app.clearCache();

app.clearCache = function() {
	document.cookie = 'userName=' + "";
	document.cookie = 'userEmail=' + "";
}