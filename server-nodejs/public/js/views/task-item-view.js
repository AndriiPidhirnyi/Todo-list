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
		var event = event || window.event,
			target = $(event.target) || $(event.srcElement),
			parent = target.parents(".task-item");

		this.model.set('isDone', target.prop("checked") );

		if (this.model.get('isDone') === true ) {
			parent.append('<p class="complited-task">Complited task</p>');
		} else {
			if ( parent.find(".complited-task").length ) {
				parent.children(".complited-task").remove();
			}
		}
	},

	synchModel: function() {
		// syncronyze with server
		console.log("model was changed");
	}
});

app.parseDate = function(millsec) {
	var date = new Date(millsec);
	return dateFormat = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}