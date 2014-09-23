var app = app || {};

app.viewInstance = null;

app.UserView = Backbone.View.extend({
	el: '#wrapper',

	loginTemplate: _.template($('#login-template').html()),
	regTemplate: _.template($('#registration-template').html()),

	events: {
		'click .sign-in-btn':		'signIn',
		'keypress .login-form': 	'enterPress',
		'blur #user-email-field':	'getUser',
		'click .reg-page-link':		'goToRegPage',
		// register view events
		'focus .input-box input': 	'clearMarkClass',
		'blur #user-nick-field':	'checkNick',
		'blur #user-email-input':	'checkUserEmail',
		'blur #user-password-field':'checkPassword',
		'click .reg-user-btn':		'regUser'
	},

	initialize: function() {
		app.viewInstance = this;
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
			that = this,
			hasError = false;

		if (app.loggedUser == null && userPassword.val().length) {
			app.showModalDialog({
				title: "Error",
				text: "User with this email wasn't found.</br>You can register a user with this email.",
				callback: function() {
					app.viewInstance.$el.html( app.viewInstance.regTemplate() );
					hasError = true;
				}
			});
			// event.preventDefault();
			// return false;
		}

		// if user email field is empty
		if (!userEmail.length) {
			hasError = true;
			// event.preventDefault();
			// return false;
		}

		// password field is empty
		if (!userPassword.val().length) {
			app.showModalDialog({
				title: "Error",
				text: "Type the password!",
				callback: function() {
					userPassword.focus();
					hasError = true;
				}
			});
			// event.preventDefault();
			// return false;
		}

		// check password
		if (app.loggedUser['password'] !== userPassword.val()) {
			app.showModalDialog({
				title: 'Error',
				text: 'The password is wrong!<br/>Try again!',
				callback: function() {
					userPassword
						.val("")
						.focus();
					hasError = true;
				}
			});
			// event.preventDefault();
			// return false;
		}

		if (!hasError) {
			// if all is ok
			this.$el.html("");

			// send success user authorization to the server
			$.ajax({
				type: "POST",
				url: window.location.pathname,
				data: {
					name: app.loggedUser.name,
					email: userEmail
				}
			});

			window.location.assign(window.location.origin);
		}

		event.preventDefault();
		return false;
	},

	clearMarkClass: function(event) {
		var targetElem = $(event.target) || $(window.event.srcElement),
			container = targetElem.parent(".input-box");

		// remove class
		if ( container.hasClass("fail") || container.hasClass("success") ){
			if (container.hasClass("fail") ) {
				container.removeClass("fail");
			} else {
				container.removeClass("sucess");
			}
		}
	},

	checkNick: function(event) {
		var targetElem = $(event.target) || $(window.event.srcElement),
			container = targetElem.parent(".input-box");

		if (targetElem.val() !== "")
			container.addClass("success");
	},

	checkUserEmail: function(event) {
		var targetElem = $(event.target) || $(window.event.target),
			container = targetElem.parent(".input-box");

		if (targetElem.val() !== "") {
			$.get(
				window.location.pathname,
				{
					getUser: targetElem.val()
				},
				function(data) {
					if (data !== "") {
						app.showModalDialog({
							title: 'Error',
							text: 'User with entered email is already register!',
							callback: function() {
								targetElem.val("");
								container.addClass('fail');
							}
						});
						return;
					}
					container.addClass('success');
				}
			);
		}

		checkEmailFormat();

		function checkEmailFormat() {
			if ( targetElem.val() !== "" && targetElem.val().indexOf("@") == -1) {
				app.showModalDialog({
					title: 'Error',
					text: 'Email has wrong format. Correct it!',
					callback: function() {
						targetElem.select();
					}
				});
			}
		}
	},

	checkPassword: function(event) {
		var event = event || window.event,
			targetElem = $(event.target) || $(event.srcElement);

		if (window.location.hash !== '#reg-page') return;

		if ( targetElem.val() !== "") {
			targetElem.parent('.input-box').addClass('success');
		}
	},

	regUser: function(event) {
		var event = event || window.event,
			nickInput = $("#user-nick-field"),
			emailInput = $("#user-email-input"),
			passwordInput = $("#user-password-field"),
			hasEmptyField = false;

		if ( nickInput.val() === "" ) {
			nickInput.parent(".input-box").addClass('fail');
			hasEmptyField = true;
		}

		if ( emailInput.val() === "") {
			emailInput.parent(".input-box").addClass('fail');
			hasEmptyField = true;
		}

		if ( passwordInput.val() === "" ) {
			passwordInput.parent(".input-box").addClass('fail');
			hasEmptyField = true;
		}

		if (hasEmptyField) {
			app.showModalDialog({
				title: 'Error',
				text: 'Please, fill empty field!'
			});

			event.preventDefault();
			return false;
		}

		// if all is ok
		this.$el.html("");

		// send success user authorization to the server
		$.ajax({
			type: "POST",
			url: "/",
			data: {
				name: nickInput.val().toLowerCase().trim(),
				email: emailInput.val().toLowerCase().trim(),
				password: passwordInput.val().toLowerCase().trim()
			},
			success: function() {
				window.location.assign(window.location.origin);
			}
		});

		event.preventDefault();
		return false;
	},

	enterPress: function() {
		var event = event || window.event;

		if (event.keyCode === 13) {
			// event.currentTarget.submit();
			event.preventDefault();
			return false;
		}
	},

	getUser: function() {
		var userEmail = $('#user-email-field').val();

		if (!userEmail.length) return;

		$.ajax({
			type: "GET",
			url: "/login",
			data: {
				getUser: userEmail
			},
			success: function(data) {
				if (data.length) {
					app.loggedUser = JSON.parse(data);
					return;
				}
				app.loggedUser = null;
			}
		});

	}
});