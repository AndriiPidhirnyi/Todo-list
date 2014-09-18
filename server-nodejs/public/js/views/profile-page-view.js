var app = app || {};
app.profilePageInst = null;

app.ProfilePageView = Backbone.View.extend({
	el: ".task-list-holder",

	template: _.template( $("#task-list-template").html() ),

	events: {
		"click #add-task-btn": "addTask"
	},

	initialize: function() {
		app.profilePageInst = this;
		app.taskCollect = new app.TaskCollection();

		$.ajax({
			type: "GET",
			url: window.location.pathname,
			data: {
				getLoggedUser: "getLoggedUser",
				getUserList: "getUserList",
				getUserTasks: "getUserTasks",
			},
			success: function(data) {
				var resObj = JSON.parse(data);
				app.loggedUser = resObj.loggedUser;
				app.userRegList = resObj.usersList;
				app.userTasks = resObj.userTasks;

				// render
				app.userPaneView = new app.UserPaneView({});
				app.profilePageInst.render();
			}
		});
	},

	render: function() {
		this.$el.html( this.template() );

		// temp code
		var defview = new app.TaskItemView({
			model: new app.TaskItem({})
		});
		// defview.render();

		app.taskCollect.add( new app.TaskItem({}));
	},

	addTask: function () {
		var event = event || window.event;
			elem = $(event.target) || $(window.event.scrElement),
			txtElem = $("textarea#task-item"),
			whoAddElem = $("input#users-list");

		var taskText = txtElem.val();
		var addToUser = whoAddElem.val();

		var taskModel = new app.TaskItem({
			text: taskText,
			addedBy: addToUser,
			date: (new Date()).valueOf(),
			numb: app.taskCollect.length
		});

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

			app.taskCollect.add(model);

			var view = new app.TaskItemView({
				model: model.toJSON()
			});

			// this.$("#tab-my-task").append( view.render() );
		}
	}

});