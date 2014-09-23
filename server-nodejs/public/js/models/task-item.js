var app = app || {};

app.TaskItem = Backbone.Model.extend({
	text: "task text",
	author: "task author",
	executor: "user name",
	date: 00000001,
	isDone: false
});

app.TaskCollection = Backbone.Collection.extend({
	model: app.TaskItem
});