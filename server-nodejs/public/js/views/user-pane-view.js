var app = app || {};
app.loggedUser = null;
app.userRegList = null;
app.userView = null;

app.UserPaneView = Backbone.View.extend({
	el: "#wrapper .header-holder",

	template: _.template( $("#header-user-template").html() ),

	events: {
		'click #logout-btn': 'logout'
	},

	initialize: function() {
		app.userView = this;
		this.render();
	},

	render: function() {
		app.userView.$el.html( app.userView.template(app.loggedUser) );
	},

	logout: function(event) {
		var target = $(event.target) || $(window.event.target);

		$.ajax({
			type: "GET",
			url: "/logout",
			data: {
				logout: true
			},
			success: function() {
				window.location.assign(window.location.origin + "/login");
			}
		});
	}
});