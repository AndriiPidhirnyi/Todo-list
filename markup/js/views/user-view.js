var app = app || {};

app.UserView = Backbone.View.extend({
	el: '#wrapper',

	loginTemplate: _.template($('#login-template').html()),
	regTemplate: _.template($('#registration-template').html()),

	initialize: function() {
		this.render();
		this.setLoginIconAnim();
	},

	render: function() {
		this.$el.html(this.loginTemplate());
	},

	setLoginIconAnim: function(){
		var userInput = $("#user-login-field"),
			userIcon = $(".user-icon"),
			passwordInput = $("#user-password-field"),
			passwordIcon = $(".pswd-icon"),
			iconOffset = parseInt(userIcon.css('left'));

		userIcon.css("left", "1px");
		passwordIcon.css("left", "1px");

		userInput.focus(function(){
			userIcon.animate( {left: iconOffset + "px"});
		});

		userInput.blur(function(){
			userIcon.animate({left: "1px"});
		});

		passwordInput.focus(function(){
			passwordIcon.animate({left: iconOffset + "px"})
		});

		passwordInput.blur(function(){
			passwordIcon.animate( {left: "1px"});
		});
	}
});
