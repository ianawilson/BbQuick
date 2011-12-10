$(document).ready(init);

function init() {
	
	$(".button").mouseover(function() {
		$(this).addClass("mouseover");
	});
	$(".button").mouseout(function() {
		$(this).removeClass("mouseover");
	});
}
