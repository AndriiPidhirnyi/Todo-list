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
				var userTasks = resObj.userTasks;

				// render
				app.userPaneView = new app.UserPaneView({});
				app.profilePageInst.initCollectfill( userTasks );
				app.profilePageInst.render();
			}
		});
	},

	render: function() {
		this.$el.html( this.template() );
		this.renderCollection( app.taskCollect );
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
		}
	},

	initCollectfill: function(modelArr) {
		for (var i = modelArr.length; i--; ) {
			var tempModel = new app.TaskItem({
				text: modelArr[i].text,
				addedBy: modelArr[i].addedBy,
				date: app.parseDate(+modelArr[i].date),
				numb: app.taskCollect.length
			});

			app.taskCollect.add( tempModel );
		}
	},

	renderCollection: function (collect) {
		for (var i = collect.length; i--; ) {
			new app.TaskItemView({
				model: collect.at(i).toJSON()
			});
		}
	}
});