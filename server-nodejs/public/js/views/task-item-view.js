var app = app || {};

app.TaskItemView = Backbone.View.extend({

	el: "#tab-my-task",

	displayTemplate: _.template( $("#task-item-display-template").html() ),
	editTemplate: _.template( $("#task-item-edit-template").html() ),

	events: {
	},

	initialize: function() {
		this.render();
	},

	render: function () {
		var content = this.displayTemplate({
				text: this.model.text,
				date: app.parseDate(1411065054684),
				addedBy: this.model.addedBy,
				numb: this.model.numb
			});

		this.$el.append( content );
	}
});

app.parseDate = function(millsec) {
	var date = new Date(millsec);
	return dateFormat = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}