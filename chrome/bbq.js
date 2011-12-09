$(document).ready(init);

var button = "<div class='button'></div>";
var announce = "<p class='info'></p>";
var courses;

function init() {
	// get the courses from the background page
	courses = chrome.extension.getBackgroundPage().courses;

	// add the course buttons
	for (i = 0; i<courses.length; i++) {
		var div = $(button).html(courses[i]["name"]);

		div.click(function() {
			showCourse(i);
		});
	
		$("#courseDiv").append(div);
	}
	
	// add highlighting effect to the course buttons
	$(".button").mouseover(function() {
		$(this).addClass("mouseover");
	});
	$(".button").mouseout(function() {
		$(this).removeClass("mouseover");
	});
	
	//get announcements
	var announcements = getRecentAnnouncements(10);
	for (i = 0; i<announcements.length; i++) {
		var announce = $(button).html(announcements[i]);
		$("#mainAnnouncements").append(announce);
	}
}

function showCourse(buttonID) {
	$(".wrapper").hide();
	$("#class").show();
}