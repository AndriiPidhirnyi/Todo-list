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
		this.listenTo(this.model, "destroy", this.destroyModel);
	},

	render: function () {
		var content = this.displayTemplate({
				text: this.model.get("text"),
				date: app.parseDate( +this.model.get("date") ),
				author: (this.model.get("author") !== app.loggedUser.name) ?
							"(added by user: " + this.model.get("author") + ")" : "",
				numb: this.model.get("numb")
			});

		this.$el.html( content );
		this.$el.append('<p class="complited-task">Complited task</p>');
		return this.$el;
	},

	deleteTask: function() {
		var root = this;

		app.showModalDialog({
			title: 'Warning',
			text: 'Do you do want to remove this task?',
			callback: function(isAgree) {

				if (isAgree) {
					$.ajax({
						type: 'DELETE',
						url: window.location.pathname + "remove-task",
						data: {
							text: root.model.get("text"),
							date: root.model.get("date"),
							userEmail: app.loggedUser.email
						},
						success: function(data) {
							if (data === "true") {
								root.model.destroy();
							}
						}
					});
				}
			}
		});

		event.preventDefault();
		return false;
	},

	doneTask: function() {
		var event = event || window.event,
			target = $(event.target) || $(event.srcElement),
			parent = target.parents(".task-item");

		this.model.set('isDone', target.prop("checked") );

		if (this.model.get('isDone') === true ) {
			parent.find(".complited-task").css({"display": "block" });
		} else {
			parent.find(".complited-task").css({"display": "" });
		}
	},

	synchModel: function() {
		// syncronyze with server
		$.ajax({
			type: "POST",
			url: "/" + "change-task",
			async: false,						// because server is single threading
			data: {
				text: this.model.get("text"),
				executor: app.loggedUser.name,	// correct this expression
				date: this.model.get("date"),
				isDone: this.model.get("isDone")
			},
			success: function() {}
		});
	},

	destroyModel: function() {
		// remove the view which corresponds to the destroyed model
		this.remove();
	}

});

app.parseDate = function(millsec) {
	var date = new Date(millsec);
	return dateFormat = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}