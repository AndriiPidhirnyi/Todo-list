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
		var date = new Date(1411065054684);
		var dateFormat = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear(),
			content = this.displayTemplate({
				text: this.model.text,
				date: dateFormat,
				addedBy: this.model.addedBy,
				numb: this.model.numb
			});

		this.$el.append( content );
	}

});