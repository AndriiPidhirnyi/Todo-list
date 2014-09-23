var app = app || {};

app.TaskItemView = Backbone.View.extend({

	tagName: "article",
	className: "task-item",

	displayTemplate: _.template( $("#task-item-display-template").html() ),
	editTemplate: _.template( $("#task-item-edit-template").html() ),

	events: {
		"change input[type=checkbox]":	"doneTask",
		"click input#del-task-btn":		"deleteTask",
		"dblclick .task-text label":	"editTask",
		"mousedown .task-form": 		"setUnselectable",
		"selectstart .task-form": 		"setUnselectable"
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
							"(added by user: " + this.model.get("author") + ")" : ""
			});

		this.$el.html( content );
		return this.$el;
	},

	deleteTask: function() {
		var root = this;

		if ( app.loggedUser.name === this.model.get("author") ) {
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
		} else {
			app.showModalDialog({
				title: "Error",
				text: "You can't remove this task!</br>It hasn't been created by you."
			});
		}

		event.preventDefault();
		return false;
	},

	doneTask: function() {
		var event = event || window.event,
			target = $(event.target) || $(event.srcElement),
			label = target.siblings(".task-text").children("label");

		this.model.set('isDone', target.prop("checked") );

		if (this.model.get('isDone') === true ) {
			label.css({"text-decoration":"line-through"});
		} else {
			label.css({"text-decoration":""});
		}
	},

	editTask: function(ev) {
		var event = event || window.event,
			targetElem = $(event.target) || $(event.srcElement);

		console.log(targetElem);
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
	},

	setUnselectable: function() {
		var event = event || window.event;

		event.preventDefault();
		return false;
	}

});

app.parseDate = function(millsec) {
	var date = new Date(millsec);
	return dateFormat = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}