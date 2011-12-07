// these should not end in slashes !
var engineURL = 'http://localhost:8000';
var bbURL = 'http://my.rochester.edu';

// temporary storage for what we've already got
var contentURL = null;
var coursesURL = null;
var authenticated = false;
var courses = new Array(0);

$(document).ready(function() {
	getContentURL(function(data) {
		response = JSON.parse(data);
		contentURL = response["contentURL"];
	});
	// getCoursesURL(function(data) {
	// 	response = JSON.parse(data);
	// 	console.log(response)
	// 	coursesURL = response['contentURL'];
	// });
	isAuthenticated(setAuthenticated);
});

function setAuthenticated(data) {
	response = JSON.parse(data);
	authenticated = response["authenticated"];
}

function getContentURL(success) {
	$.get(bbURL + '/', function(data) {
		$.post(engineURL + '/getContentURL/', {'html': data}, success);
	});
}

function getNavURL(success) {
	$.get(bbURL + '/', function(data) {
		$.post(engineURL + '/getNavURL/', {'html': data}, success);
	});
}

function getCoursesURL(success) {
	getNavURL(function(data) {
		response = JSON.parse(data)
		$.get(bbURL + response['navURL'], function(data) {
			$.post(engineURL + '/getCoursesURL/', {'html': data}, function(data) {
				response = JSON.parse(data)
				console.log(response['coursesURL'])
				$.get(bbURL + response['coursesURL'], function(data) {
					$.post(engineURL + '/getContentURL/', {'html': data}, success)
				});
			});
		});
	});
}

function isAuthenticated(success) {
    getContentURL(function(data) {
		response = JSON.parse(data);
		$.get(bbURL + response['contentURL'], function(data) {
			$.post(engineURL + '/isAuthenticated/', {'html': data}, success);
		});
	});
}

function getCourses() {
	if (authenticated) { 
		$.get(bbURL + contentURL, function(data) {
			$.post(engineURL + '/getCourses/', {'html': data}, function(data) {
				response = JSON.parse(data);
				courses = response['courses'];
				if (courses.length > 0) {
					for (i in courses) {
						course = courses[i];
						//getCourseSections(course);
					}
				}
			});
		});
	} else {
		console.log('User not authenticated.');
	}
}

function getCourseSections(course) {
	$.get(bbURL + course['url'], function(data) {
		$.post(engineURL + '/getCourseSections/', {'html': data}, function(data) {
			response = JSON.parse(data);
			course['sections'] = response['sections'];
			for (i in course['sections']) {
				section = course['sections'][i];
				getCourseSubsections(section);
			}
		});
	});
}

function getCourseSubsection(section) {
	$.get(bbURL + section['url'], function(data) {
		$.post(engineURL + '/getCourseSubsections/', {'html': data}, function(data) {
			response = JSON.parse(data);
			section['subsections'] = response['subsections'];
		});
	});
}
