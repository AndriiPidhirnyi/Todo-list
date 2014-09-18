var app = app || {};

if (app.UserView) {
	app.userView = new app.UserView({});
}

if (app.PageView) {
	app.pageView = new app.PageView({});
}

app.userPaneView = new app.UserPaneView({});