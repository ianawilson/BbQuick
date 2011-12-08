/*dummy data setup -- will be replaced with local storage*/
var data = new Array();

var courseArr = new Array();

var course1 = new Array();
course1["name"] = "Human Computer Interaction";
course1["url"] = "javascript:show(class1);";
course1["shortName"] = "csc212";

var course2 = new Array();
course2["name"] = "Pervasive Computing";
course2["url"] = "javascript:show(class2);";
course2["shortName"] = "csc297";

var course3 = new Array();
course3["name"] = "Film History: Early Cinema";
course3["url"] = "javascript:show(class3);";
course3["shortName"] = "eng255";

var course4 = new Array();
course4["name"] = "The Poetics of Television";
course4["url"] = "javascript:show(class4);";
course4["shortName"] = "eng263";

courseArr[0] = course1;
courseArr[1] = course2;
courseArr[2] = course3;
courseArr[3] = course4;

data["courses"] = courseArr;

//alert(data["courses"][3]["name"]);
/*end dummy data setup*/

$(document).ready(function() {
	for (i = 0; i<data["courses"].length; i++) {
		$("#courses").append("<a href='" +
					data["courses"][i]["url"] + "'><div class='button'>" +
					data["courses"][i]["name"] + "</div></a>");
	}
});

function show(classID) {
	$(".wrapper").addClass("hidden");
	$(classID).removeClass("hidden");
}