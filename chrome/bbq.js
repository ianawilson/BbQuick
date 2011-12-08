$(document).ready(init);

var button = "<div class='button'></div>";

function init() {

	for (i = 0; i<data["courses"].length; i++) {
		var div = $(button).html(data["courses"][i]["name"]);

		div.click(function() {
			showCourse(i);
		});
	
		$("#courses").append(div);
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