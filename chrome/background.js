// these should not end in slashes !
var engineURL = 'http://localhost:8000';
var bbURL = 'http://my.rochester.edu';

// temporary storage for what we've already got
var contentURL = null;
var coursesURL = null;
var authenticated = false;
var courses = new Array(0);
var newCourses = new Array(0);
var loginForm = null;

$(document).ready(init);

function init() {
	getContentURL(function(data) {
		response = JSON.parse(data);
		contentURL = response["contentURL"];
	});
	isAuthenticated(start);
	// refresh in 5 minutes
	setTimeout(init, 5*60*1000);
	// update courses 30 seconds from now, after they're probably gotten (2 minutes is safer, 4 is safest, but I don't want
	// to put it off too long)
	setTimeout(updateCourses, 10*1000);
}

function updateCourses() {
	console.log('Starting to update courses.');
	// go through newCourses
	for (newIndex in newCourses) {
		oldIndex = findSubMember(courses, 'shortname', newCourses[newIndex]['shortname']);
		if (oldIndex >= 0) {
			console.log("Updating course " + newCourses[newIndex]['shortname']);
			// exists, update it
			courses[oldIndex]['name'] = newCourses[newIndex]['name'];
			
			// run through sections
			newSections = newCourses[newIndex]['sections'];
			
			for (newSectionIndex in newSections) {
				oldSectionIndex = findSubMember(courses[oldIndex]['sections'], 'name', newSections[newSectionIndex]['name']);
				if (oldSectionIndex >= 0) {
					console.log("  Updating section " + newSections[newSectionIndex]['name']);
					courses[oldIndex]['sections'][oldSectionIndex]['url'] = newSections[newSectionIndex]['url'];
					
					// run through subsections
					newSubsections = newSections[newSectionIndex]['subsections'];
					
					for (newSubsectionIndex in newSubsections) {
						oldSubsectionIndex = findSubMember(courses[oldIndex]['sections'][oldSectionIndex]['subsections'], 'details', newSubsections[newSubsectionIndex]['details']);
						
						if (oldSubsectionIndex >= 0) {
							console.log("    Updating subsection " + newSubsections[newSubsectionIndex]['name']);
							courses[oldIndex]['sections'][oldSectionIndex]['subsections'][oldSubsectionIndex]['author'] = newSubsections[newSubsectionIndex]['author'];
							courses[oldIndex]['sections'][oldSectionIndex]['subsections'][oldSubsectionIndex]['date'] = newSubsections[newSubsectionIndex]['date'];
							courses[oldIndex]['sections'][oldSectionIndex]['subsections'][oldSubsectionIndex]['name'] = newSubsections[newSubsectionIndex]['name'];
						}
					}
				} else {
					// section doesn't exist, grab it, then splice to insert it
					courses[oldIndex]['sections'].splice(newIndex, 0, newSections[newSectionIndex]);
				}
			}
		} else {
			// course doesn't exist, grab it, then use splice to insert it
			courses.splice(newIndex, 0, newCourses[newIndex]);
		}
	}
	console.log("Done updating courses.");
}
function findSubMember(arr, member, value) {
	for (i in arr) {
		if (arr[i][member] == value) {
			return i;
		}
	}
	return -1;
}

/**
 * Whole bunch of async
 **/

function start(data) {
	response = JSON.parse(data);
	authenticated = response["authenticated"];
	loginForm = response["loginForm"];
	getCourses();
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
				newCourses = response['courses'];
				if (newCourses.length > 0) {
					for (i in newCourses) {
						course = newCourses[i];
						getCourseSections(course);
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
		$.post(engineURL + '/getCourseSections/', {'html': data, 'url': course['url']}, function(data) {
			response = JSON.parse(data);
			course['sections'] = response['sections'];
			for (i in course['sections']) {
				section = course['sections'][i];
				getCourseSubsections(section);
			}
		});
	});
}

function getCourseSubsections(section) {
	$.get(bbURL + section['url'], function(data) {
		$.post(engineURL + '/getCourseSubsections/', {'html': data}, function(data) {
			response = JSON.parse(data);
			section['subsections'] = response['subsections'];
		});
	});
}

/**
 * Quick Functions for getting data
 **/

// get recent announcements
function getRecentAnnouncements(limit) {
	if (limit == null) {
		limit = 10;
	}
	
	announcements = []
	for (course in courses) {
		// announcements are always the first section, and they are guaranteed to exist by parsley
		theseAnnce = newCourses[course]['sections'][0]['subsections']
		announcements = announcements.concat(theseAnnce)
	}
	// ======= REMOVE BAD ELEMENTS FROM HERE ========
	for (i in announcements) {
		if (announcements[i]['author'] == null) {
			announcements.splice(i, 1);
		}
	}
	
	announcements.sort(function(a, b) {
		console.log('===')
		console.log(a)
		console.log(b)
		// b - a so that they are sorted with the most recent (highest) first
		if (b == null) {
			return a;
		}
		return announceSorted(b) - announceSorted(a);
	});
	
	// cut off everything after limit
	announcements.splice(limit)
	
	return announcements
}
function announceSorted(item) {
	ms = 0;
	console.log(item)
	if (item['date'] == null) {
		return 0;
	}
	if (item['date'].length > 0) {
		ms = Date.parse(item['date']);
	}
	return ms;
}