/*dummy data setup -- will be replaced with local storage*/
var data = new Array();

var courseArr = new Array();

var course1 = new Array();
course1["name"] = "Human Computer Interaction";
course1["url"] = "my.rochester.edu";
course1["shortname"] = "csc212";

var course2 = new Array();
course2["name"] = "Pervasive Computing";
course2["url"] = "my.rochester.edu";
course2["shortname"] = "csc297";

var course3 = new Array();
course3["name"] = "Film History: Early Cinema";
course3["url"] = "my.rochester.edu";
course3["shortname"] = "eng255";

var course4 = new Array();
course4["name"] = "The Poetics of Television";
course4["url"] = "my.rochester.edu";
course4["shortname"] = "eng263";

courseArr[0] = course1;
courseArr[1] = course2;
courseArr[2] = course3;
courseArr[3] = course4;

data["courses"] = courseArr;

//alert(data["courses"][3]["name"]);
/*end dummy data setup*/
