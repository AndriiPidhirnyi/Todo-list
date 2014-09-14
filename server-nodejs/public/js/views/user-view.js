var app = app || {};

app.UserView = Backbone.View.extend({
	el: '#wrapper',
	activeUser: null,

	loginTemplate: _.template($('#login-template').html()),
	regTemplate: _.template($('#registration-template').html()),

	events: {
		'click .sign-in-btn':	'signIn',
		'keypress .login-form': 'enterPress',
		'click .reg-page-link': 'goToRegPage'
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

	signIn: function(event) {
		var userName = $('#user-name-field').val().toLowerCase().trim(),
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
			event.preventDefault();
			return false;
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
			event.preventDefault();
			return false;
		}

		// wrong password
		if (user[0].get('password') !== userPassword.val()) {
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

		// all is ok
		event.preventDefault();
		this.$el.html("");
		this.sendRequest({
			"userName": userName,
			"selected": true
		});

		return false;
	},

	findField: function(collect, prop) {
		return collect.where(prop);
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

	sendRequest: function(opts) {
		var xhr = new XMLHttpRequest(),
			params = 'name='+ encodeURIComponent(opts.userName) +
			'&selected=' + encodeURIComponent(opts.selected);

		xhr.open("POST", '/login', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) return;

			var pageUrl = location.href;
			window.location = pageUrl.slice(0, pageUrl.lastIndexOf('/'));
		}

		xhr.send(params);
	}
});
