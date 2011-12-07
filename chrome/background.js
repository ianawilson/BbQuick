// these should not end in slashes !
var engineURL = 'http://localhost:8000';
var bbURL = 'http://my.rochester.edu';

// temporary storage for what we've already got
var contentURL = null;
var authenticated = false;
var courses = new Array(0);

$(document).ready();

function getContentURLAsync(success) {
	$.get(bbURL + '/', function(data) {
		$.post(engineURL + '/getContentURL/', {'html': data}, success);
	});
}

function isAuthenticatedAsync(success) {
    getContentURLAsync(function(data) {
		response = JSON.parse(data);
		$.get(bbURL + response['contentURL'], function(data) {
			$.post(engineURL + '/isAuthenticated/', {'html': data}, success);
		});
	});
}

function getCoursesAsync(success) {
	if (authenticated) {
		$.get(bbURL + contentURL, function(data) {
			$.post(engineURL + '/getCourses/', {'html': data}, function(data) {
				response = JSON.parse(data);
				courses = response['courses'];
				if (success != null && typeof success == 'function') {
					success.call(this, courses);
				}
			});
		});
	}
}

function getCourseSectionsAsync(success) {
	if (courses.length > 0) {
		for (i in courses) {
			course = courses[i];
			$.get(bbURL + course['url'], function(data) {
				$.post(engineURL + '/getCourseSections/', {'html', data}, function(data) {
					response = JSON.parse(data);
					course['sections'] = response['sections'];
					if (success != null && typeof sucess == 'function') {
						success.call(this, course['sections']);
					}
				});
			});
		}
	}
}