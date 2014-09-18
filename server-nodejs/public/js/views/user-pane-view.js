var app = app || {};
app.viewInstance = null;

app.UserPaneView = Backbone.View.extend({
	el: "#wrapper .header-holder",

	template: _.template( $("#header-user-template").html() ),

	events: {
		'click #logout-btn': 'logout'
	},

	initialize: function() {
		app.viewInstance = this;
		this.render();
	},

	render: function() {
		$.ajax({
			type: "GET",
			url: window.location.pathname,
			data: {
				getLoggedUser: "getLoggedUser"
			},
			success: function(data) {
				app.viewInstance.$el.html( app.viewInstance.template( JSON.parse(data) ) );
			}
		});
	},

	logout: function(event) {
		var target = $(event.target) || $(window.event.target);

		$.ajax({
			type: "GET",
			url: window.location.origin + "/logout",
			data: {
				logout: true
			},
			success: function() {
				window.location.assign(window.location.origin + "/login");
			}
		});
	}
});