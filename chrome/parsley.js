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
	if (authenticated) { 
		$.get(bbURL + contentURL, function(data) {
			
			var html = $(data);
			var header = html.find(".moduleTitle:contains(Courses Online)");
			var container = header.parent().parent();
			var trs = container.find('tr');
			var newCourses = new Array(0);
			
			for (var i = 0; i < trs.length; i++) {
				var anchor = $(trs[i]).find('a');
				if (anchor.length > 0) {
					course = {};
					raw = anchor.text();
					// splice wasn't working for me (object has no method 'splice'), so we use split and rejoin
					rawList = raw.split('-');
					// rejoin all but the last one
					if (rawList.length > 2) {
						// pop last item, use the rest to make the name
						rawSemester = rawList.pop();
						rawName = rawList.join("-");
					} else {
						rawName = rawList[0];
						rawSemester = rawList[1];
					}
					
					course['name'] = $.trim(rawName).toLowerCase().toTitleCase();
					course['semester'] = $.trim(rawSemester);
					course['url'] = anchor.attr('href');
					newCourses.push(course);
				}
			}
			
			console.log(newCourses);
			
			
			if (newCourses.length > 0) {
				for (i in newCourses) {
					course = newCourses[i];
					getCourseSections(course);
				}
			}
		});
	} else {
		console.log('User not authenticated.');
	}
}

function getCourseSections() {
	
}

function getCourseSubsections() {
	
}