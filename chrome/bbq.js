$(document).ready(init);

var button = "<div class='button'></div>";
var courses;

function init() {
	courses = chrome.extension.getBackgroundPage().courses;

	for (i = 0; i<courses.length; i++) {
		var div = $(button).html(courses[i]["name"]);

		div.click(function() {
			showCourse(i);
		});
	
		$("#courseDiv").append(div);
	}
	
	$(".button").mouseover(function() {
		$(this).addClass("mouseover");
	});
	$(".button").mouseout(function() {
		$(this).removeClass("mouseover");
	});
}

function showCourse(buttonID) {
	$(".wrapper").hide();
	$("#class").show();
}