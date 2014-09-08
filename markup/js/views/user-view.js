var app = app || {};

app.UserView = Backbone.View.extend({
	el: '#wrapper',
	activeUser: null,

	loginTemplate: _.template($('#login-template').html()),
	regTemplate: _.template($('#registration-template').html()),

	events: {
		'click .reg-page-link': 'goToRegPage',
		'click .sign-in-btn':	'signIn'
	},

	initialize: function() {
		this.render();
		this.setLoginIconAnim();
	},

	render: function() {
		this.$el.html(this.loginTemplate());
	},

	setLoginIconAnim: function(){
		var userInput = $("#user-name-field"),
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
	},

	goToRegPage: function() {
		this.$el.html("");
		this.$el.html(this.regTemplate());
	},

	signIn: function() {
		var userName = $('#user-name-field').val().toLowerCase(),
			userPassword = $('#user-password-field'),
			user = this.findField(app.userbase, {name: userName}),
			that = this;

		if (!!!user.length) {
			app.showModalDialog({
				title: "Error",
				text: "User with typed email wasn't found.<br/>Register new user!",
				callback: function() {
					$('.reg-page-link').focus();
				}
			});
			return;
		}

		// password field is empty

		if (userPassword.val().length === 0) {
			app.showModalDialog({
				title: 'Error',
				text: 'Please, enter password',
				callback: function() {
					userPassword.focus();
				}
			});
			return;
		}

		// wrong password
		if (user[0].get('password') !== userPassword.val()) {
			app.showModalDialog({
				title: 'Error',
				text: 'The type password is wrong!<br/>Try again!',
				callback: function() {
					userPassword.focus();
				}
			});
			return;
		}

		// all is ok
		user[0].set('selected', true);
		this.activeUser = userName;
		this.$el.html("");
	},

	findField: function(collect, prop) {
		return collect.where(prop);
	}
});
