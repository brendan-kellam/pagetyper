console.log("running...");

var displayed = document.getElementById("display-content");
var interpreted = document.getElementById("interpreted-content");

var file = "/static/auto-scroll/test.html";

var contents = "";
var index = 0;


var timer;
var line = "";
var pause = 200;
var isInterpreted = true;
var isDisplayed = false;

// CSS related input
var cssBuffer = "";
var isCSS = false;

// speed related input
var setSpeed = false;

function looper() {

	// get current character
	var c = contents[index];

	switch (c) {
		case '\n':
			if (isDisplayed) displayed.innerHTML += "<br>";
			if (isInterpreted) interpret();
			isInterpreted = true;

			line = "";
			
			iterate();
			return;

		case '\t':
			displayed.innerHTML += "&nbsp&nbsp&nbsp&nbsp";
			iterate();
			return;

		// not interpreted
		case '~':
			isInterpreted = false;
			iterate();
			return;

		// speed set
		case '≈':
			setSpeed = true;
			isDisplayed = false;
			iterate();
			return;

		case '˚':
			iterate(pause);
			return;


		default:
			break;
	}


	if (isDisplayed) displayed.innerHTML += c;
	line += c;

	iterate();
}

function interpret() {

	switch (line) {
		case "<style>":
			cssStart();
			break;

		case "</style>":
			cssStop();
			break;

		default:
			if (isCSS) 
				cssBuffer += line;
			else if(setSpeed) {
				speedSet();
			} else
				interpreted.innerHTML += line;
			
			break;
	}

}

var speed = 100;
function iterate(time) {

	// if time is not set, use speed
	var rate = (time == null) ? speed : time;

	if (index < contents.length-1) {
		timer = setTimeout(looper.bind(null), rate);
		index++;
	}
}

function cssStart() {
	displayed.style.color = "red";


	cssBuffer += line;
	isCSS = true;
}

function cssStop() {
	displayed.style.color = "#00FF00";

	cssBuffer += line; 
	interpreted.innerHTML += cssBuffer;

	cssBuffer = "";
	isCSS = false;
}

function speedSet() {
	speed = parseInt(line);
	setSpeed = false;
	isDisplayed = true;
}


/* getFileContents: Handles reading from local resources */
function getFileContents(file, callback) {

	// ajax linker
	$.ajax({
		url : file,

		// on success, call callback
		success : function(result){
			if ($.isFunction(callback))
				callback.apply(null, [result]);
		}

	});
}

function cursorAnimation() {
    $('#cursor').animate({
        opacity: 0
    }, 'fast', 'swing').animate({
        opacity: 1
    }, 'fast', 'swing');
}


$(document).ready(function() {

	setInterval ('cursorAnimation()', 600);

	// START
	getFileContents(file, 
		function(result) {
			contents = result;
			looper();
		});

});

