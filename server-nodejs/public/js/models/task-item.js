var app = app || {};

app.TaskItem = Backbone.Model.extend({
	text: "task text",
	addedBy: "user Name",
	date: "00.00.0000",
	isDone: false
});


app.TaskCollect = Backbone.Collection.extend({
	model: app.TaskItem
});