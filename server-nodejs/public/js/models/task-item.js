var app = app || {};

app.TaskItem = Backbone.Model.extend({
	text: "task text",
	author: "task author",
	executor: "user name",
	date: 00000001,
	isDone: false
});

app.TaskCollection = Backbone.Collection.extend({

	model: app.TaskItem,

	comparator: function(a, b) {
		var val1 = parseInt(a.get("date")),
			val2 = parseInt(b.get("date")),
			factor = 1;

		if (val1 > val2) return -1 * factor;
		if (val2 < val1) return 1 * factor;
		return 0;
	}
});