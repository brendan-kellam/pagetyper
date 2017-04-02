
// define the parser's triggers
var PTrigger = {
	nline : '^',
	space : '~',
	speed : '≈',
	wait : '˚',
	html : 'ƒ',
	trigger : 't',
};

// init default auto-scroll speed
var speed = 50;


var cachedHtmlLines = [];
var cachedHtmlIndex = 0;
var interpretHTML = 0;

var test = document.getElementById("test");

var buffer = [];
var index = 0;

function push(obj){
	buffer.push(obj);
}

function pop(){
	return buffer[index++];
}

class Line {

	this.str;
	this.callback;

	get string() {
		return this.string;
	}

	get callback() {
		return this.callback;
	}

	setCallback(cb){
		this.callback cb;
	}

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


var count = 0; 
function frameLooper(array, element) {

 	var timer;
 	var temp

	if (array.length > 0){
		element.scrollTop = element.scrollHeight;
		temp = array.shift();

		switch(temp) {

			case PTrigger.nline: // On new line
				element.innerHTML += "<br>";

				break;

			case PTrigger.html:
				element.innerHTML += "<br>";
				var t = pop();
				console.log(t);
				test.innerHTML += t; 

				break;

			case PTrigger.space:
				element.innerHTML += "&nbsp";
				break;

			case PTrigger.speed:
				speed = pop();
				break;

			case PTrigger.wait:
				timer = setTimeout(frameLooper.bind(null, array, element), pop());
				return;

			default:
				element.innerHTML += temp;
		}

	}else{

		clearTimeout(timer);
		//console.log("here");
		//return;
	}

	timer = setTimeout(frameLooper.bind(null, array, element), speed);

}


/* formatStr: accepts raw string and converts to a "screen-drawable" format */
function formatStr(str){	

	var output = "", line = "", htmlLine = "";

	// loop each character of accepted string
	for (var i = 0, len = str.length, c = ""; i < len; i++){
		c = str[i];

		// switch-case on a given character
		switch(c){

			case PTrigger.html:
				interpretHTML = 1; // allow the program to interpret the html 
				break;

			/* NEW LINES */
			case '\n': // new-line

				if (interpretHTML) {
					push(htmlLine);
					htmlLine = "";
					interpretHTML = 0;

					line += PTrigger.html;
					output += line;
					line = "";
					console.log("here");
					break;
				}

				line += PTrigger.nline;
				output += line;
				line = "";
				break; 

			/* TAB */ 
			case '\t': // tab
				line += "~~~~~~~~"; // NOTE: A '~' character indicates a space
				break;

			/* SPEED SET */
			case PTrigger.speed:
				i = pushInteger(str, i);
				output += PTrigger.speed;
				break;

			/* WAIT CHAR */
			case PTrigger.wait:
				i = pushInteger(str, i);
				output += PTrigger.wait;
				break;

			/* DEFAULT */
			default: // default behavior
				line += c;

				if (interpretHTML)
					htmlLine += c;
				break;
				
		}

	}
	// return formated string
	return output;
}


function formatStrTest(lines){

	var len = lines.length;
	var line = "";

	for (var i = 0; i < len; i++){

		line = lines[i];

		console.log(line);

		if (line.cont)

	}

}

function setSpeed(str){

}

/* getLines: converts a string to a array of it's lines */
function getLines(str){

	// initialize variables
	var c = "", s = "";
	var len = str.length;
	var lines = [];
	var newLine = false;
	var line;

	// loop each character of string
	for (var i = 0; i < len; i++){

		// get character
		c = str[i];

		if (newLine) {
			newLine = false;

			// create new line object
			line = new Line();

			switch(c){

				case PTrigger.speed:
					line.setCallback(setSpeed);
					break;

				default:
					break;
			}


		}

		// handle tabbing
		if (c != '\t') s += c;
		else {
			s += "~~~~~~~~";
		}

		// check for new line
		if (c == '\n') {

			// push line to lines array
			lines.push(s);
			s = "";
			newLine = true;
		}
	}

	// return lines array
	return lines;
}




/* pushInteger: pulls one-line integer from text file and pushes it to the buffer */
function pushInteger(str, index){
	var val = "", c = "";
	while ((c = str[++index]) != '\n')
		val += c;

	// push the value 
	push(Number(val));

	// return the new index
	return index;
}



function writeOut(file, element){
	
	getFileContents(file, function(str) {
		var output = formatStrTest(getLines(str));	
	
		frameLooper(output.split(""), element)		

	});
}

	