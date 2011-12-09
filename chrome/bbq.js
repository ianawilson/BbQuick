$(document).ready(function() {
	init();
	buildMain();
});

var buttonHtml = "<div class='button'></div>";
var announceHtml = "<div class='announcement'></div>";
var addPageHtml = '<div class="small button" title="Add the current page as a resource for this course.">+ add page</div>';
var breadcrumbHtml = '<div id="breadcrumbs"><a>home</a> &raquo; </div>';

var courses;
var bbURL;

function init() {
	// get the courses from the background page
	courses = chrome.extension.getBackgroundPage().courses;
	
	// get the blackboard url from the background page
	bbURL = chrome.extension.getBackgroundPage().bbURL;
}

function buildMain() {
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
	var announcements = chrome.extension.getBackgroundPage().getRecentAnnouncements(10);
	for (i = 0; i<announcements.length; i++) {
		announcement = $(announceHtml).html("<p class='announcementInfo'>On " + announcements[i]['date'] + " " + announcements[i]['author'] + " posted:</p><p>" + announcements[i]['details'] + "</p>");
		$("#mainAnnouncements").append("<hr class='short-hr' />").append(announcement);
	}
	
	runHandlers();
}

function runHandlers() {
	// add highlighting effect to the course buttons
	$(".button").mouseover(function() {
		$(this).addClass("mouseover");
	});
	$(".button").mouseout(function() {
		$(this).removeClass("mouseover");
	});
}

function showMain() {
	$(".wrapper").hide();
	$("#main").show()
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
	
	// add subsections
	subsections = section['subsections'];
	for (i in subsections) {
		button = $(buttonHtml).append(subsections[i]['name']);
		button.attr('target', bbURL + subsections[i]['url']);
		button.click(function() {
			chrome.tabs.create({'url': $(this).attr('target')})
		});
		$("#section").append(button);
	}
	
	runHandlers();
}