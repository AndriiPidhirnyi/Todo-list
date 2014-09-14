var app = app || {};

app.showModalDialog = function (obj) {
	var innerText = '<div id="modal-window-holder">',
		timerID,
		res = 'undefined';

	innerText = '<div class="modal-window ' + obj.title.toLowerCase() + '-msg">';
	innerText += '<h2>' + obj.title + '</h2>';
	innerText += '<p>' + obj.text + '</p>';
	innerText += '<form action="#" class="info-form"><fieldset>';
	innerText += '<button class="confirm-btn" type="button">Ok</button>';
	if (obj.title.toLowerCase() !== "error") innerText += '<button class="cancel-btn" type="button">Cancel</button></fieldset></form></div></div>';
	var elem = $(innerText);

	elem.click(function(e) {
		if(e.target.innerText === "Ok") {
			obj.callback(true);
			this.remove();
		}

		if(e.target.innerText === "Cancel") {
			obj.callback(false);
			this.remove();
		}
	});

	$('#wrapper').append(elem);
	elem.find('.confirm-btn').focus();
}