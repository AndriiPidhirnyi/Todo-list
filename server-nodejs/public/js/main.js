var app = app || {};

if (app.UserView) {
	app.userView = new app.UserView({});
};

if (app.PageView) {
	app.pageView = new app.PageView({});
};

if ( app.ProfilePageView ) {
	app.profilePageView = new app.ProfilePageView({});
};

setTimeout(function() {

	if (location.pathname == "/login") return;

	jQuery(function() {
		initAutocomplete({
			elem: "#users-list",
			list: ".auto-user-list",
			holder: ".add-task-box"
		});
	});

	function initAutocomplete(opt) {
		var options = $.extend({
				elem: ".text-field",
				list: ".list-holder"
			}, opt);
		var elem = $(options.elem),
			list = $(options.list),
			text = "",
			isDeployed = false,
			listBorderList = parseInt( list.css("border-left-width") );

		// set list the same width as the input element
		list.width( elem.outerWidth() - listBorderList*2 );

		// set position of the list with suggestions
		list.css({"top": Math.ceil( elem.position( options.holder ).top + elem.outerHeight() ) ,
				  "left": Math.ceil( elem.position( options.holder ).left ) });

		// add the listener of click on list item
		list.on("click", function(event) {
			if (event.target.tagName == "LI") {
				text = event.target.innerText
				elem.val( text );
				elem.get(0).setSelectionRange( text.length, text.length );
				list.css("display", "");
				isDeployed = false;
			}
		});

		// add listener on keypress event
		elem.on("input", function(event) {
			getUserListByPartName();
		});

		elem.on("keydown", function(event) {
			var pressKey = event.keyCode;

			// pressed key "arrow down"
			if ( pressKey === 40 && isDeployed) {
				var activeLi = list.find("li.active"),
					newActiveElem = null;

				if (activeLi.length !== 0) {
					if (activeLi.next("li").length !== 0) {
						newActiveElem = activeLi.next();

						activeLi.removeClass("active");
						newActiveElem.addClass("active");
						elem.val( newActiveElem.text() );
					} else {
						activeLi.removeClass("active");
						elem.val( text );
					}
				} else {
					newActiveElem = list.children("li").first();

					newActiveElem.addClass("active");
					elem.val( newActiveElem.text() );
				}
				return;
			}

			// pressed key "arrow up"
			if ( pressKey === 38 && isDeployed) {
				var activeLi = list.find("li.active"),
					newActiveElem = null;

				if (activeLi.length !== 0) {
					if (activeLi.prev("li").length !== 0) {
						newActiveElem = activeLi.prev();

						activeLi.removeClass("active");
						newActiveElem.addClass("active");
						elem.val( newActiveElem.text() );
					} else {
						activeLi.removeClass("active");
						elem.val( text );
					}
				} else {
					newActiveElem = list.children("li").last();

					newActiveElem.addClass("active");
					elem.val( newActiveElem.text() );
				}

				// move caret to the end
				var len = elem.val().length;
				elem.get(0).setSelectionRange(len, len);

				event.preventDefault();
				return false;
			}

			// press key "Escape"
			if ( pressKey === 27) {
				list.css("display", "");
				elem.val( text );
				isDeployed = false;
				return;
			}

			// press key enter
			if ( pressKey === 13 && isDeployed) {
				var activeLi = list.find("li.active");

				if (activeLi.length !== 0) {
					list.css("display", "");
					elem.val( activeLi.text() );
					isDeployed = false;
				}
				return;
			}
		});

		function getUserListByPartName() {
			setTimeout(function() {
				text = elem.val().trim();
				var re = new RegExp("^"+ text, "i"),
					outObj = [];

				app.userRegList.forEach(function(item) {
					if (item.search(re) != -1) outObj.push(item);
				});

				showList(outObj);
			},0);
		}

		function showList(arr) {
			var docFragment = $(document.createDocumentFragment());

			list.html("");

			if (arr.length !== 0) {
				arr.forEach(function(item) {
					docFragment.append("<li>" + item + "</li>");
				});

				list.css("display", "block");
				list.append(docFragment);
				isDeployed = true;
			} else {
				list.css("display", "")
				isDeployed = false;
			}
		};
	};

},500);
