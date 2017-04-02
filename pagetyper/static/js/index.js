console.log("running...");

var displayed = document.getElementById("display-content");
var interpreted = document.getElementById("interpreted-content");

var bottom = document.getElementById("bottom");
var top = document.getElementById("top");

var file = "/static/auto-scroll/test.html";
var running = false;

var contents = "";
var index = 0;


var timer;
var line = "";
var pause = 200;
var isInterpreted = true;
var isDisplayed = true;

// CSS related input
var cssBuffer = "";
var isCSS = false;

var buffer = [];

function looper() {

	// get current character
	var c = contents[index];
	switch (c) {
		case '\n':
			if (isDisplayed) displayed.innerHTML += "<br>";
			interpret();
			line = "";
			return;

		case '\t':
			//buffer.push("&nbsp&nbsp&nbsp&nbsp");
			displayed.innerHTML += "&nbsp&nbsp&nbsp&nbsp";
			return;


		default:
			break;
	}

	displayed.innerHTML += c;
	line += c;

	/*
	if (isDisplayed) buffer.push(c);
	line += c;

	if (buffer.length > 5) {
		displayed.innerHTML += buffer.join("");
		buffer = [];
	}*/
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
			else
				interpreted.innerHTML += line;

			break;
	}

}

function cssStart() {
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


function httpGet(url) {
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    
    } else {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            return xmlhttp.responseText;
        }
    }

    xmlhttp.open("GET", url, false );
    xmlhttp.send();    
}


$(document).ready(function() {
	// init animated cursor
	setInterval ('cursorAnimation()', 600);
	

	// START

	/*
	getFileContents(file, 
		function(result) {
			contents = result;
			console.log(contents);
		});*/

	//contents = "<html> hello world! </html>"

	
	
	var i = 0;
	$(document).keypress(function(e) {
		if (index < contents.length-1 ) {

			if (contents != "") {

				while (i++ < 5) {
					looper();
					index++;
				}
				i = 0;
			}
		} else if(buffer.length != 0) {
			displayed.innerHTML += buffer.join("");
			buffer = [];
		}
	});	


});

var your_url = "http://burnie.com/";

jQuery.ajax = (function(_ajax){

	var protocol = location.protocol,
	    hostname = location.hostname,
	    exRegex = RegExp(protocol + '//' + hostname),
	    YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
	    query = 'select * from html where url="{URL}" and xpath="*"';

	function isExternal(url) {
	    return !exRegex.test(url) && /:\/\//.test(url);
	}

	return function(o) {

	    var url = o.url;

	    if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {

	        // Manipulate options so that JSONP-x request is made to YQL

	        o.url = YQL;
	        o.dataType = 'json';

	        o.data = {
	            q: query.replace(
	                '{URL}',
	                url + (o.data ?
	                    (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
	                : '')
	            ),
	            format: 'xml'
	        };

	        // Since it's a JSONP request
	        // complete === success
	        if (!o.success && o.complete) {
	            o.success = o.complete;
	            delete o.complete;
	        }

	        o.success = (function(_success){
	            return function(data) {

	                if (_success) {
	                    // Fake XHR callback.
	                    _success.call(this, {
	                        responseText: data.results[0]
	                            // YQL screws with <script>s
	                            // Get rid of them
	                            .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
	                    }, 'success');
	                }

	            };
	        })(o.success);

	    }

	    return _ajax.apply(this, arguments);

	};

})(jQuery.ajax);


$.ajax({
	url: your_url,
	type: 'GET',
	success: function(res) {
	    contents = res.responseText;
	    console.log(contents);
	}
});

