var app = app || {};

app.TaskItem = Backbone.Model.extend({
	text: "task text",
	addedTo: "user Name",
	date: 4145113355321,
	isDone: false,
	numb: 0
});


app.TaskCollection = Backbone.Collection.extend({
	model: app.TaskItem
});