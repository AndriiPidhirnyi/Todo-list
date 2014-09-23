var app = app || {};
// app.profilePageInst = null;

app.ProfilePageView = Backbone.View.extend({
	el: ".task-list-holder",

	template: _.template( $("#task-list-template").html() ),

	events: {
		"click #add-task-btn": 		"addTask",
		"keyup textarea#task-item": "enableBtnAddTask"
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
				root.render();
				root.initCollectFill( resObj.userTasks );
			}
		});

		this.listenTo(app.taskCollect, "add", this.addOneItem);
	},

	render: function() {
		this.$el.html( this.template() );

		// set addTask button disabled
		$("#add-task-btn").attr("disabled", "disabled");
	},

	addTask: function () {
		var event = event || window.event;
			elem = $(event.target) || $(window.event.scrElement),
			txtElem = $("textarea#task-item"),
			whoAddElem = $("input#users-list");

		var taskText = txtElem.val();
		var addToUser = whoAddElem.val();

		var taskModel = new app.TaskItem({});
		taskModel.set("text", taskText);
		taskModel.set("executor", ( addToUser.length !== "")? addToUser : app.loggedUser.name);
		taskModel.set("author", app.loggedUser.name);
		taskModel.set("date", (new Date()).valueOf() );
		taskModel.set("numb", app.taskCollect.length );
		taskModel.set("isDone", false);

		addNewModel(taskModel);

		txtElem.val("");
		whoAddElem.val("");

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
						app.taskCollect.add(model);

						var view = new app.TaskItemView({
							model: model
						});
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
			tempModel.set("numb", app.taskCollect.length);
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
		var view = new app.TaskItemView({ model: model });
		this.$('#tab-my-task').append( view.render() );
	}
});