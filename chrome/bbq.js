$(document).ready(function() {
	init();
});

var buttonHtml = "<div class='button'></div>";
var announceHtml = "<div class='announcement'></div>";
var addPageHtml = '<div class="small button" title="Add the active tab as a resource for this course.">+ add active tab</div>';
var breadcrumbHtml = '<div id="breadcrumbs"><a>home</a> &raquo; </div>';
var editShowHideHtml = '<a class="editShowHide internal" href="#">edit - show / hide</>';

var courses;
var bbURL;
var loginForm;
var authenticated;
var bg;

// active variables for show / hide
var activeCourse = -1;
var activeSection = -1;

function init() {
	// get the background page
	bg = chrome.extension.getBackgroundPage();
	
	// get the courses, blackboard url, and login form
	courses = bg.courses;
	bbURL = bg.bbURL;
	loginForm = bg.loginForm;
	authenticated = bg.authenticated;
	
	if (authenticated && courses.length > 0) {
		showMain();
	} else if (authenticated) {
		buildWait();
		showWait();
	} else {
		buildLogin();
		showLogin();
	}
}

function buildWait() {
	wait = $("<p></p><h2>BbQuick is Still Working</h2><p class='centered'>Please reload the popup in a moment.</p>");
	$("#wait").append(wait);
}

function buildLogin() {
	login = $("<p></p><h2>BbQuick Needs You to Login</h2><p class='centered'>Please login on <a href='" + bbURL + "'>Blackboard</a>.</p>");
	refresh = $("<a href='#' class='internal'>Refresh BbQuick manually.</a>").click(function() {
		bg.init();
		window.close();
	});
	refreshPara = $("<p class='centered'>Already logged in? </p>").append(refresh);
	
	$("#login").append(login);
	$("#login").append(refreshPara);
	
	runHandlers();
}

function runHandlers() {
	
	/**
	 * Highlighting effect to the course buttons
	 **/
	
	$(".button").mouseover(function() {
		$(this).addClass("mouseover");
	});
	$(".button").mouseout(function() {
		$(this).removeClass("mouseover");
	});
	
	
	/**
	 * Place hide / show buttons
	 **/
	
	var hideToggleHtml = "<div class='hideToggle'><img src='uparrow.png' /> <span class='internal'>hide</span></div>";
	
	wrapperSelector = ".wrapper:visible";
	$(".button").not(".small").after(hideToggleHtml);
	$(".hideToggle").hide();
	
	$(".hideToggle").click(function() {
		// var t = setTimeout(hideButton, 500, $(this));
		hideButton($(this).prev().attr('id'));
	});
	
	$(".editShowHide").click(enterEdit);
	
	var buttons = $(".button").not(".small");
	for (i = 0; i<buttons.length; i++) {
		button = $(buttons[i]);
		buttonID = button.attr('id');
		if (getHidden(buttonID)) {
			button.hide();
			button.next().hide();
			// hideButton(button.next());
			hideButton(button.attr('id'));
		}
	}	
	
	/**
	 * Convert anchors to tab creators
	 **/
	$(wrapperSelector).find('a').not('.internal').not('#breadcrumbs a').click(function() {
		chrome.tabs.create({'url': $(this).attr('href')});
		window.close();
	});
}

function enterEdit() {
	$(".editShowHide").html("collapse - show / hide");
	$(".editShowHide").unbind("click", enterEdit);
	$(".editShowHide").click(exitEdit);
	
	buttons = $(".button").not("small");
	buttons.slideDown();
	buttons.next().slideDown();
}

function exitEdit() {
	$(".editShowHide").html("edit - show / hide");
	$(".editShowHide").unbind("click", exitEdit);
	$(".editShowHide").click(enterEdit);
	
	var buttons = $(".button").not(".small");
	for (i = 0; i<buttons.length; i++) {
		button = $(buttons[i]);
		buttonID = button.attr('id')
		
		// console.log(activeCourse + ', ' + activeSection + ', ' + buttonID);
		// console.log(hidden);
		if (getHidden(buttonID)) {
			button.slideUp();
			button.next().slideUp();
			// hideButton(button.next());
			hideButton(button.attr('id'));
		}
	}
	
	$(".button").not(".small").next().slideUp();
}

function getHidden(buttonID) {
	if (activeCourse >= 0) {
		if (activeSection >= 0) {
			hidden = courses[activeCourse]['sections'][activeSection]['subsections'][buttonID]['hidden'];
		} else {
			hidden = courses[activeCourse]['sections'][buttonID]['hidden'];
		}
	} else {
		hidden = courses[buttonID]['hidden'];
	}
	
	return hidden;
}
function setHidden(buttonID, hidden) {
	if (activeCourse >= 0) {
		if (activeSection >= 0) {
			courses[activeCourse]['sections'][activeSection]['subsections'][buttonID]['hidden'] = hidden;
		} else {
			courses[activeCourse]['sections'][buttonID]['hidden'] = hidden;
		}
	} else {
		courses[buttonID]['hidden'] = hidden;
	}
}

function hideButton(buttonID) {
	var button = $("#" + buttonID);
	console.log(button);
	var toggle = button.next();
	
	button.addClass("hiddenButton");
	toggle.html("<img src='downarrow.png' /> <span class='internal'>show</span>");
	setHidden(button.attr('id'), true);
	
	toggle.unbind("click");
	toggle.click(function() {
		var toggle = $(this);
		var button = toggle.prev();
		
		button.removeClass("hiddenButton");
		toggle.html("<img src='uparrow.png' /> <span class='internal'>hide</span>");
		
		setHidden(button.attr('id'), false);
		toggle.unbind("click");
		toggle.click(function() {
			hideButton($(this).prev().attr('id'));
		});
	});
}

function showWait() {
	$(".wrapper").hide();
	$("#wait").show();
	
	runHandlers();
}

function showLogin() {
	$(".wrapper").hide();
	$("#login").show();
	
	runHandlers();
}

function showMain() {
	$(".wrapper").hide();
	clearAll();
	activeCourse = -1;
	activeSection = -1;
	
	addJq = $(addPageHtml);
	addJq.click(function() {
		showAddPage();
	});
	$("#main").append(addJq);
	
	$("#main").append($("<div id='header'><h1> BbQuick Courses </h1></div>"));
	
	coursesDiv = $("<div id='courses'></div>");
	coursesDiv.append(editShowHideHtml);
	
	// add the course buttons
	for (i in courses) {
		var div = $(buttonHtml).html(courses[i]["name"]);
		div.attr('id', i);
		div.click(function() {
			showCourse($(this).attr('id'));
		});
	
		coursesDiv.append(div);
	}
	
	// finally, add the courses div to the main
	$("#main").append(coursesDiv);
	
	//get announcements
	var announcements = chrome.extension.getBackgroundPage().getRecentAnnouncements();
	$("#course").append("<h2>Announcements</h2>");
	makeAnnouncements("#main", announcements);
	
	$("#main").show();
	
	runHandlers();
}

function showCourse(courseID) {
	// hide last thing, ready this by clearing it
	$(".wrapper").hide();
	clearAll();
	activeCourse = courseID;
	activeSection = -1;
	course = courses[courseID];
	
	// add the add page button
	addJq = $(addPageHtml)
	addJq.click(function() {
		showAddPage(courseID);
	});
	$("#course").append(addJq);
	
	// build the breadcrumb
	breadcrumb = $(breadcrumbHtml).append(course['shortname']);
	breadcrumb.find("a").click(function() {
		showMain();
	});
	$("#course").append(breadcrumb);
	
	// add title
	$("#course").append("<h1>" + course['name'] + "</h1>");
	
	$("#course").append(editShowHideHtml);
	
	// build sections
	sections = course['sections'];
	// start at 1 because the first element is always announcements, which we don't want a button for
	for (i = 1; i < sections.length; i++) {
		button = $(buttonHtml).html(sections[i]['name']);
		button.attr('id', i);
		if (sections[i]['subsections'] == null || sections[i]['subsections'].length == 0) {
			button.click(function() {
				url = sections[$(this).attr('id')]['url'];
				url = bg.makeURL(url);
				chrome.tabs.create({'url': url});
			});
		} else {
			button.click(function() {
				showSection(courseID, $(this).attr('id'));
			});
		}
		$("#course").append(button)
	}
	// announcements are always the first section
	announcements = course['sections'][0]['subsections']
	if (announcements.length > 0) {
		$("#course").append("<h2>Announcements</h2>");
		makeAnnouncements("#course", announcements);
	}
	
	$("#course").show();
	
	runHandlers();
}

function showSection(courseID, sectionID) {
	// hide last thing, ready this by clearing it
	$(".wrapper").hide();
	clearAll();
	activeCourse = courseID;
	activeSection = sectionID;
	course = courses[courseID];
	section = course['sections'][sectionID];
	
	// add the add page button
	addJq = $(addPageHtml);
	addJq.click(function() {
		showAddPage(courseID, sectionID);
	});
	$("#section").append(addJq);
	
	// build the breadcrumb
	breadcrumb = $(breadcrumbHtml)
	breadcrumb.find("a").click(function() {
		showMain();
	});
	courseBreadcrumb = $("<a>" + course['shortname'] + "</a>").click(function() {
		showCourse(courseID);
	});
	breadcrumb.append(courseBreadcrumb);
	breadcrumb.append(" &raquo; ");
	breadcrumb.append(section['name']);
	$("#section").append(breadcrumb);
	
	$("#section").append("<h1>" + section['name'] + "</h1>");
	
	$("#section").append(editShowHideHtml);
	
	// add subsections
	subsections = section['subsections'];
	for (i in subsections) {
		button = $(buttonHtml).append(subsections[i]['name']);
		button.attr('id', i);
		button.click(function() {
			url = subsections[$(this).attr('id')]['url'];
			url = bg.makeURL(url);
			chrome.tabs.create({'url': url});
			window.close();
		});
		$("#section").append(button);
	}
	
	$("#section").show();
	
	runHandlers();
}

function clearAll() {
	// clear everything so that we don't have any conflicting button ids
	$("#main").empty();
	$("#course").empty();
	$("#section").empty();
}

function makeAnnouncements(divSelector, announcements) {
	for (i = 0; i<announcements.length; i++) {
		if (announcements[i]['author']) {
			announcement = $(announceHtml).html("<p class='announcementInfo'>On " + announcements[i]['date'] + " " + announcements[i]['author'] + " posted:</p><p>" + announcements[i]['details'] + "</p>");
			$(divSelector).append("<hr class='short-hr' />").append(announcement);
		}
	}
}

function showAddPage(courseID, sectionID) {
	$("#add").empty();
	
	if (!courseID) {
		courseID = 0;
	}
	if (!sectionID) {
		sectionID = -1;
	}
	// console.log(courseID);
	// console.log(sectionID);
	
	$("#add").append("<h2>Add the active tab as a resource for</h2>");
	courseSelect = $("<select class='centered' id='courseSelect'></select>");
	for (i in courses) {
		courseSelect.append("<option value='" + i + "'>" + courses[i]['name'] + "</option>");
	}
	courseSelect.change(function() {
		rebuildSectionSelect($(this).val());
	})
	$("#add").append(courseSelect);
	
	$("#add").append("<h2>and file it under</h2>");
	sectionSelect = $("<select class='centered' id='sectionSelect'></select>");
	$("#add").append(sectionSelect);
	
	$("#courseSelect option[selected]").removeAttr("selected");
	$("#courseSelect option[value='" + courseID + "']").attr("selected", "selected");
	
	rebuildSectionSelect(courseID, sectionID);
	
	$("#add").append("<h2>with the name</h2>");
	$("#add").append("<input id='addName'></input>");
	
	chrome.tabs.getSelected(null, function(tab) {
		$("#addName").val(tab.title);
	});
	
	cancel = $("<div id='addCancel' class='button'>Cancel</div>");
	cancel.click(showMain);
	$("#add").append(cancel);
	submit = $("<div id='addSubmit' class='button'>Add Page</div>");
	submit.click(function() {
		selectedCourse = $("#courseSelect").val();
		selectedSection = $("#sectionSelect").val();
		selectedName = $("#addName").val();
		
		if (selectedName != "") {
			
			if (selectedSection < 0) {
				chrome.tabs.getSelected(null, function(tab) {
					newContent = {"name": selectedName, "url": tab.url};
					courses[selectedCourse]['sections'].push(newContent);
					showCourse(selectedCourse);
				});
			} else {
				chrome.tabs.getSelected(null, function(tab) {
					newContent = {"name": selectedName, "url": tab.url};
					courses[selectedCourse]['sections'][selectedSection]['subsections'].push(newContent);
					showSection(selectedCourse, selectedSection);
				});
			}
		}
	})
	$("#add").append(submit);
	
	$(".wrapper").hide();
	$("#add").show();
}

function rebuildSectionSelect(courseID, sectionID) {
	sectionSelect = $("#sectionSelect");
	sectionSelect.empty();
	// console.log(courseID)
	
	sectionSelect.append("<option value='-1'>-- Just put it directly inside " + courses[courseID]['shortname'] + " --</option>");
	
	for (i = 1; i < courses[courseID]['sections'].length; i++) {
		// console.log(sectionSelect);
		// console.log(courses[courseID]['sections'][i]['name']);
		sectionSelect.append("<option value='" + i + "'>" + courses[courseID]['sections'][i]['name'] + "</option>");
	}
	
	$("#sectionSelect option[selected]").removeAttr("selected");
	$("#sectionSelect option[value='" + sectionID + "']").attr("selected", "selected");
}
