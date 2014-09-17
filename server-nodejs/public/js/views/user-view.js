var app = app || {};
var loggedUser;
var viewInstance;

app.UserView = Backbone.View.extend({
	el: '#wrapper',

	loginTemplate: _.template($('#login-template').html()),
	regTemplate: _.template($('#registration-template').html()),

	events: {
		'click .sign-in-btn':		'signIn',
		'keypress .login-form': 	'enterPress',
		'blur #user-email-field': 	'getUser',
		'click .reg-page-link':		'goToRegPage'
	},

	initialize: function() {
		viewInstance = this;
		this.render();
		this.setLoginIconAnim();
	},

	render: function() {
		this.$el.html(this.loginTemplate());
	},

	setLoginIconAnim: function(){
		var userInput = $("#user-email-field"),
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

	signIn: function(event) {
		var userEmail = $('#user-email-field').val().toLowerCase().trim(),
			userPassword = $('#user-password-field'),
			that = this;

		if (loggedUser == null && userPassword.val().length) {
			app.showModalDialog({
				title: "Error",
				text: "User with this email wasn't found.</br>You can register a user with this email.",
				callback: function() {
					viewInstance.$el.html( viewInstance.regTemplate() );
				}
			});
			event.preventDefault();
			return false;
		}

		// if user email field is empty
		if (!userEmail.length) {
			event.preventDefault();
			return false;
		}

		// password field is empty
		if (!userPassword.val().length) {
			app.showModalDialog({
				title: "Error",
				text: "Type the password!",
				callback: function() {
					userPassword.focus();
				}
			});
			event.preventDefault();
			return false;
		}

		// check password
		if (loggedUser['password'] !== userPassword.val()) {
			app.showModalDialog({
				title: 'Error',
				text: 'The password is wrong!<br/>Try again!',
				callback: function() {
					userPassword
						.val("")
						.focus();
				}
			});
			event.preventDefault();
			return false;
		}

		// if all is ok
		this.$el.html("");
		debugger;
		document.cookie = 'userName=' + loggedUser["name"];
		document.cookie = 'userEmail=' + loggedUser["email"];

		window.location = window.location.origin;

		event.preventDefault();
		return false;
	},

	enterPress: function(event) {
		var target = event.target || event.srcElement;

		// if (event.keyCode == 13 && target.type == "submit") {
		if (event.keyCode === 13) {
			// event.currentTarget.submit();
			event.preventDefault();
			return false;
		}
	},

	getUser: function() {
		var xhr = new XMLHttpRequest(),
			userEmail = $('#user-email-field').val(),
			params = "?getUser=" + userEmail;

		if (!userEmail.length) return;

		xhr.open("GET", '/login' + params, false);
		xhr.onreadystatechange = function() {
			if (xhr.readyState !== 4) return;

			if (xhr.responseText.length) {
				loggedUser = JSON.parse(xhr.responseText);
				return;
			}
			loggedUser = null;
		}

		xhr.send(null);
	}
});