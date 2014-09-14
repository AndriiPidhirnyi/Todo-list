var app = app || {};

app.UserBase = Backbone.Collection.extend({
	model: app.UserModel,
});