var app = app || {};

app.TaskItemView = Backbone.View.extend({

	tagName: "article",
	className: "task-item",

	displayTemplate: _.template( $("#task-item-display-template").html() ),
	editTemplate: _.template( $("#task-item-edit-template").html() ),

	events: {
		"click input#del-task-btn": 	"deleteTask",
		"change input[type=checkbox]": 	"doneTask"
	},

	initialize: function() {
		this.listenTo(this.model, "change", this.synchModel);
	},

	render: function () {
		var content = this.displayTemplate({
				text: this.model.get("text"),
				date: app.parseDate( +this.model.get("date") ),
				addedBy: (this.model.get("addedBy") !== app.loggedUser.name) ?
							"(added by user: " + this.model.get("addedBy") + ")" : "",
				numb: this.model.get("numb")
			});

		this.$el.html( content );
		return this.$el;
	},

	deleteTask: function() {
		console.log("Delete task");

		event.preventDefault();
		return false;
	},

	doneTask: function() {
		var event = event || window.event;
		var target = $(event.target) || $(event.srcElement);

		this.model.set('isDone', target.prop("checked") );
	},

	synchModel: function() {
		// syncronyze with server

	}
});

app.parseDate = function(millsec) {
	var date = new Date(millsec);
	return dateFormat = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}