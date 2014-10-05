var app = app || {};
// app.profilePageInst = null;

app.ProfilePageView = Backbone.View.extend({
	el: ".task-list-holder",

	template: _.template( $("#task-list-template").html() ),

	events: {
		"click #add-task-btn": 			"addTask",
		"keyup textarea#task-item":		"enableBtnAddTask",
		"click input[type=checkbox]":	"changeModel"
	},

	initialize: function() {
		var root = this;
		app.taskCollect = new app.TaskCollection();

		$.ajax({
			type: "GET",
			url: "/",
			data: {
				getLoggedUser: "getLoggedUser",
				getUserList: "getUserList",
				getUserTasks: "getUserTasks",
			},
			success: function(data) {
				var resObj = JSON.parse(data);
				app.loggedUser = resObj.loggedUser;
				app.userRegList = resObj.usersList;

				// render all page
				app.userPaneView = new app.UserPaneView({});

				// remove notes, that there are no tasks
				if (resObj.userTasks.length != 0) {
					root.$el.find(".list-grad #tab-my-task").html("");
				}
				// add models to collection, which are arrived from server db
				root.initCollectFill( resObj.userTasks );
				root.render();
			}
		});

		// listeners of model and collection
		this.listenTo(app.taskCollect, "add", this.addOneItem);
		this.listenTo(app.taskCollect, "remove", this.removeModel);
	},

	render: function() {
		this.$el.html( this.template() );
		this.renderList();

		// set addTask button disabled
		$("#add-task-btn").attr("disabled", "disabled");
	},

	addTask: function () {
		var event = event || window.event;
			elem = $(event.target) || $(window.event.scrElement),
			txtElem = $("textarea#task-item"),
			whoAddElem = $("input#users-list"),
			root = this;


		var taskText = txtElem.val().trim()[0].toUpperCase() + txtElem.val().trim().slice(1);
		var addToUser = (whoAddElem.val() !== "" ) ? whoAddElem.val() : app.loggedUser.name;

		var taskModel = new app.TaskItem({});
		taskModel.set("text", taskText);
		taskModel.set("executor", addToUser);
		taskModel.set("author", app.loggedUser.name);
		taskModel.set("date", (new Date()).valueOf() );
		taskModel.set("isDone", false);

		addNewModel(taskModel);

		txtElem.val("");
		whoAddElem.val("");
		elem.attr("disabled", "disabled");

		event.preventDefault();
		return false;

		/**
		 * Add a new model into users model collection
		 * @param {Object} mod model with parameters
		 */
		function addNewModel(model) {
			$.ajax({
				type: "POST",
				url: "/" + "add-task",
				data: {
					text: model.get("text"),
					executor: model.get("executor"),
					date: model.get("date"),
					isDone: model.get("isDone"),
					success: function() {
						// add model into collection of user's task
						if (model.get("executor") === app.loggedUser.name) {
							app.taskCollect.add(model);

							app.taskCollect.sort();
							//
							root.renderList();

							// var view = new app.TaskItemView({
							// 	model: model
							// });
						}
					}
				}
			});
		}
	},

	initCollectFill: function(modelArr) {
		for (var i = modelArr.length; i--; ) {

			var tempModel = new app.TaskItem({});

			tempModel.set("text", modelArr[i].text);
			tempModel.set("author", modelArr[i].author);
			tempModel.set("date", modelArr[i].date);
			tempModel.set("isDone", modelArr[i].isDone);

			app.taskCollect.add( tempModel );
		}
	},

	enableBtnAddTask: function() {
		var event = event || window.event,
			target = $(event.target) || $(event.srcElement),
			btn = $("#add-task-btn");

		if (target.val().trim() !== "") {
			btn.removeAttr("disabled");
		} else {
			btn.attr("disabled", "disabled");
		}
	},

	addOneItem: function(model) {
		if (app.taskCollect.length == 1 ) {
			this.$el.find(".list-grad section").html("");
		}
	},

	changeModel: function() {
		location.reload();		// resolve problem with sorting using backbone
	},

	removeModel: function() {
		// if collection is empty
		if (app.taskCollect.length == 0) {
			this.$el.find(".list-grad section")
			.append('<div class="info-task-box"><p>You have no tasks</p></div>');
		}
	},

	renderList: function() {
		var root = this;

		if (app.taskCollect.length === 0 ) return;

		this.$('#tab-my-task').html("");

		app.taskCollect.each(function(model, index) {
			var view = new app.TaskItemView({ model: model });

			root.$('#tab-my-task').append( view.render() );

			if (model.get("isDone") === "true") {
				view.$el.find(".task-text label").addClass("task-done");
				view.$el.find("input[type=checkbox]").attr("checked", "checked");
			}
		});
	}

});

function showCollect() {
	app.taskCollect.each(function(model, index) {
		console.log( new Date(+model.get("date")) );
	});
}