// this should not end with a slash !
var bbURL = 'http://my.rochester.edu';

// temporary storage for what we've already got
var contentURL = null;
var coursesURL = null;
var authenticated = false;
var courses = new Array(0);
var newCourses = new Array(0);
var loginForm = null;

// timeouts
var initTimeout, updateCoursesTimeout;


/**
 * Helpers and Initialization
 **/

$(document).ready(init);

function init() {
	// clear timeouts just in case this was called from the popup
	clearTimeout(initTimeout);
	clearTimeout(updateCoursesTimeout);
	
	isAuthenticated();
	// wait 5 seconds to get courses, since we might need to re-evaluate login status
	getCoursesTimeout = setTimeout(getCourses, 5*1000);
	// refresh in 5 minutes
	initTimeout = setTimeout(init, 5*60*1000);
	// update courses 15 seconds from now, after they're probably gotten
	updateCoursesTimeout = setTimeout(updateCourses, 10*1000);
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
						} else {
							// section doesn't exist, grab it, then splice to insert
							console.log("    Inserting subsection " + newSubsections[newSubsectionIndex]['name']);
							courses[oldIndex]['sections'][oldSectionIndex]['subsections'].splice(newSubsectionIndex, 0, newSubsections[newSubsectionIndex]);
						}
					}
				} else {
					// section doesn't exist, grab it, then splice to insert it
					console.log("  Inserting section " + newSections[newSectionIndex]['name']);
					courses[oldIndex]['sections'].splice(newSectionIndex, 0, newSections[newSectionIndex]);
				}
			}
		} else {
			// course doesn't exist, grab it, then use splice to insert it
			console.log("Inserting course " + newCourses[newIndex]['shortname']);
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



/**
 * Major Functions
 **/

function getCourses() {
	if (authenticated) { 
		$.get(bbURL + contentURL, function(data) {
			
			var html = $(data);
			var header = html.find(".moduleTitle:contains(Courses Online)");
			var container = header.parent().parent();
			var trs = container.find('tr');
			newCourses = new Array(0);
			
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
					
					href = anchor.attr('href');
					
					// shortname
					id = anchor.parent().next();
					match = id.text().match(/(\w+)./);
					// sub 1 because we want what's in the parens
					shortname = match[1];
					course['shortname'] = shortname;
					
					course['name'] = $.trim(rawName).toLowerCase().toTitleCase();
					course['semester'] = $.trim(rawSemester);
					// the url is actually an argument in the url, we index 1 because that's the part in the paren
					course['url'] = href.match(/&url=(.+)/)[1];
					newCourses.push(course);
				}
			}
			
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

function getCourseSections(course) {
	$.get(bbURL + course['url'], function(data) {
		var html = $(data);
		sections = new Array(0);
		
		// deal with announcements first
		section = {}
		section['name'] = 'Announcements';
        section['url'] = course['url'];
        sections.push(section);
		
		ul = html.find("#courseMenuPalette_contents");
		// get all li's that aren't class divider
		lis = ul.find("li:not(.divider)");
		
		for (var i = 0; i < lis.length; i++) {
			anchor = $(lis[i]).find('a');
			
			section = {};
			section['name'] = $.trim(anchor.text());
			section['url'] = anchor.attr("href");
			
			// only push non Announcements and non Course Tools items
			if (section['name'] != 'Announcements' && section['name'] != 'Course Tools') {
				sections.push(section);
			}
		}
		
		course['sections'] = sections;
		for (i in course['sections']) {
			section = course['sections'][i];
			getCourseSubsections(section);
		}
	});
}

function getCourseSubsections(section) {
	$.get(bbURL + section['url'], function(data) {
		html = $(data);
		
		subsections = new Array(0);
		
		// most pages use an id pageList, only announcements use announcementList
		pageList = html.find("#pageList");
		announcementList = html.find("#announcementList");
		
		if (pageList.length > 0) {
			lis = $(pageList).find('li.clearfix.read');
			for (var i = 0; i < lis.length; i++) {
				anchor = $(lis[i]).find('a');
				heading = $(lis[i]).find('h3');
				if (anchor.length > 0) {
					subsection = {};
					subsection['name'] = $.trim($(heading[0]).text());
					subsection['url'] = $(anchor[0]).attr('href');
					
					subsections.push(subsection);
				}
			}
		} else if (announcementList.length > 0) {
			lis = $(announcementList).find('li.clearfix');
			
			for (var i = 0; i < lis.length; i++ ) {
				subsection = {};
				
				heading = $(lis[i]).find('h3');
				heading = $.trim(heading.text());
				subsection['name'] = heading;
				
				details = $.trim($(lis[i]).find('div.details').html());
				subsection['details'] = details;
				
				info = $(lis[i]).find('div.announcementInfo');
				spans = info.find('span');
				subsection['author'] = $.trim(spans[0].nextSibling.data).toLowerCase().toTitleCase();
				subsection['date'] = $.trim(spans[1].nextSibling.data);
				
				subsections.push(subsection);
			}
		} else {
			// nothing to see here
		}
		
		section['subsections'] = subsections;
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
	// console.log(item)
	if (item['date'] == null) {
		return 0;
	}
	if (item['date'].length > 0) {
		ms = Date.parse(item['date']);
	}
	return ms;
}