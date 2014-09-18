var app = app || {};
app.profilePageInst = null;

app.ProfilePageView = Backbone.View.extend({
	el: ".task-list-holder",

	template: _.template( $("#task-list-template").html() ),

	events: {
	},

	initialize: function() {
		app.profilePageInst = this;

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

		// init loggined user pane

	},

	render: function() {
		this.$el.html( this.template() );
	}

});