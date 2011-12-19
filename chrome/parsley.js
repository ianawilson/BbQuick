/* Helpers and Initialization */

function parsley() {
	
}

function getContentURL(callback) {
	$.get(bbURL + '/', function(data) {
		console.log("GET " + bbURL + "/ successful.");
		html = $(data);
		
		for (i in html) {
			if (html[i].tagName != null && html[i].tagName.toLowerCase() == 'noframes') {
				noframes = $(html[i].innerText);
				getNext = false;
				for (j in noframes) {
					tag = noframes[j].tagName;
					if (tag != null) {
						if (getNext && tag.toLowerCase() == 'p') {
							href = $(noframes[j]).find('a').attr('href');
							contentURL = href;
							getNext = false;
						}
						if (tag.toLowerCase() == 'h2' && noframes[j].innerText == 'Content') {
							getNext = true;
						}
					}
				}
			}
		}
		if (callback) {
			if (typeof(callback) === "function") {
				console.log("Callback exists. Calling it.");
				callback();
			} else {
				console.log("Invalid callback; type = " + typeof(callback));
			}
		} 
	});
}

function isAuthenticated() {
	getContentURL(function() {
		$.get(bbURL + contentURL, function(data) {
			html = $(data);
			login = html.find("#loginBoxFull");
			if (login.length > 0) {
				authenticated = false;
			} else {
				authenticated = true;
			}
		});
	});
}

/* Major Functions */

function getCourses() {
	
}

function getCourseSections() {
	
}

function getCourseSubsections() {
	
}