$(document).ready(function() {
	init();
});

var buttonHtml = "<div class='button'></div>";
var announceHtml = "<div class='announcement'></div>";
var addPageHtml = '<div class="small button" title="Add the current page as a resource for this course.">+ add page</div>';
var breadcrumbHtml = '<div id="breadcrumbs"><a>home</a> &raquo; </div>';
var showAllHtml = '<span class="showAllToggle">SHOW ALL</span>';

var courses;
var bbURL;
var loginForm;
var authenticated;
var bg;

function init() {
	// get the background page
	bg = chrome.extension.getBackgroundPage();
	
	// get the courses, blackboard url, and login form
	courses = bg.courses;
	bbURL = bg.bbURL;
	loginForm = bg.loginForm;
	authenticated = bg.authenticated;
	
	if (authenticated && courses) {
		// this try catch block stops us from showing the popup before all of the data is loaded
		try {
			buildMain();
			showMain();
		} catch(err) {
			buildWait();
			showWait();
		}
		
	} else if (loginForm) {
		buildLogin();
		showLogin();
	} else {
		buildWait();
		showWait();
	}
}

function buildWait() {
	wait = $("<p></p><h2>BbQuick is Still Working</h2><p class='centered'>Please reload the popup in a moment.</p>");
	$("#wait").append(wait);
}

function buildLogin() {
	loginDiv = $("<div></div>");
	login = $("<p></p><h2>BbQuick Needs You to Login</h2><p class='centered'>Please login on <a href='" + bbURL + "'>Blackboard</a>.</p>");
	refresh = $("<a href='#' class='internal'>Refresh BbQuick manually.</a>").click(function() {
		bg.init();
	});
	refreshPara = $("<p class='centered'>Already logged in? </p>").append(refresh);
	
	loginDiv.append(login);
	loginDiv.append(refreshPara);
	$("#login").append(loginDiv);
	
	// $("#login").append(loginForm);
	
	runHandlers();
}

function buildMain() {
	// throw an error to jump out of this if courses aren't loaded yet
	if (!courses.length > 0) {
		throw "Courses not loaded yet.";
	}
	
	$("#courseDiv").append(showAllHtml);
	
	// add the course buttons
	for (i in courses) {
		var div = $(buttonHtml).html(courses[i]["name"]);
		div.attr('target', i);
		div.click(function() {
			showCourse($(this).attr('target'));
		});
	
		$("#courseDiv").append(div);
	}
	
	//get announcements
	var announcements = chrome.extension.getBackgroundPage().getRecentAnnouncements();
	
	// this also throws exceptions which we catch above if all of the subsections haven't been loaded yet
	makeAnnouncements("#mainAnnouncements", announcements);
	

	runHandlers(false);
}

function runHandlers(visibleOnly) {
	if (visibleOnly == null || visibleOnly) {
		wrapperSelector = ".wrapper:visible";
	} else {
		wrapperSelector = ".wrapper";
	}
	
	// add highlighting effect to the course buttons
	$(".button").mouseover(function() {
		$(this).addClass("mouseover");
	});
	$(".button").mouseout(function() {
		$(this).removeClass("mouseover");
	});
	
	var hideToggle = "<span class='hideToggle'><img src='uparrow.png' /> HIDE</span>";
	
	$(wrapperSelector + " .button").not(".small").after(hideToggle);
	
	$(".hideToggle").click(function() {
		$(this).prev().slideUp();
		$(this).slideUp();

		//modifies button color and hide label for when shown to unhide
		//set timeout used so it doesn't change until hidden
		var t = setTimeout(hideTimeout, 500, $(this));
	});
	
	$(".showAllToggle").click(function() {
		$(".button").slideDown();
		$(".button").next().slideDown();
	});
	
	var buttons = $(".button").not(".small");
	for (i = 0; i<buttons.length; i++) {

		if (courses[$(buttons[i]).attr('target')]["hidden"]) {
			$(buttons[i]).hide();
			$(buttons[i]).next().hide();
			hideTimeout($(buttons[i]).next());
		}
	}	
	
	// convert anchors to tab creators
	
	$(wrapperSelector).find('a').not('.internal').not('#breadcrumbs a').click(function() {
		console.log('asdf');
		chrome.tabs.create({'url': $(this).attr('href')});
		window.close();
	});
}

function hideTimeout(element) {
	$(element).prev().css("background-color", "#B8B9BA");
	$(element).html("<img src='downarrow.png' /> SHOW");
	courses[$(element).prev().attr('target')]["hidden"] = true;
	
	$(element).unbind("click");
	$(element).click(function() {
		$(element).prev().css("background-color", "#0088FF");
		$(element).html("<img src='uparrow.png' /> HIDE");
		courses[$(element).prev().attr('target')]["hidden"] = false;
		$(element).unbind();
		$(element).click(function() {
			$(this).prev().slideUp();
			$(this).slideUp();

			//modifies button color and hide label for when shown to unhide
			//set timeout used so it doesn't change until hidden
			var t = setTimeout(hideTimeout, 500, $(this));
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
	$("#main").show();
}

function showCourse(courseID) {
	// hide last thing, ready this by clearing it
	$(".wrapper").hide();
	$("#course").empty();
	course = courses[courseID];
	
	// add the add page button
	$("#course").append(addPageHtml);
	$("#course").show();
	
	// build the breadcrumb
	breadcrumb = $(breadcrumbHtml).append(course['shortname']);
	breadcrumb.find("a").click(function() {
		showMain();
	});
	$("#course").append(breadcrumb);
	
	// add title
	$("#course").append("<h1>" + course['name'] + "</h1>");
	
	$("#course").append(showAllHtml);
	
	// build sections
	sections = course['sections'];
	// start at 1 because the first element is always announcements, which we don't want a button for
	for (i = 1; i < sections.length; i++) {
		console.log(i)
		button = $(buttonHtml).html(sections[i]['name']);
		button.attr('target', i);
		button.click(function() {
			showSection(courseID, $(this).attr('target'));
		});
		$("#course").append(button)
	}
	
	// announcements are always the first section
	announcements = course['sections'][0]['subsections']
	if (announcements.length > 0) {
		$("#course").append("<h2>Announcements</h2>");
		makeAnnouncements("#course", announcements);
	}
	
	runHandlers();
}

function showSection(courseID, sectionID) {
	// hide last thing, ready this by clearing it
	$(".wrapper").hide();
	$("#section").empty();
	course = courses[courseID];
	section = course['sections'][sectionID];
	
	// add the add page button
	$("#section").append(addPageHtml);
	$("#section").show();
	
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
	
	$("#section").append(showAllHtml);
	
	// add subsections
	subsections = section['subsections'];
	for (i in subsections) {
		button = $(buttonHtml).append(subsections[i]['name']);
		if (subsections[i]['url'][0] == "/") {
			button.attr('target', bbURL + subsections[i]['url']);
		} else {
			button.attr('target', subsections[i]['url']);
		}
		button.click(function() {
			chrome.tabs.create({'url': $(this).attr('target')});
			window.close();
		});
		$("#section").append(button);
	}
	
	runHandlers();
}

function makeAnnouncements(divSelector, announcements) {
	for (i = 0; i<announcements.length; i++) {
		announcement = $(announceHtml).html("<p class='announcementInfo'>On " + announcements[i]['date'] + " " + announcements[i]['author'] + " posted:</p><p>" + announcements[i]['details'] + "</p>");
		$(divSelector).append("<hr class='short-hr' />").append(announcement);
	}
}

