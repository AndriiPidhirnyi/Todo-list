var app = app || {};

app.UserModel = Backbone.Model.extend({
	defaults: {
		name: 'nickname',
		email: 'E-mail',
		password: 'user password',
		selected: false
	}
});