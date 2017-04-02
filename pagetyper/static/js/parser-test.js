


function formatStr(str){

	// initialize temp variables
	var output = "", line = "", htmlLine = "";


	var lines = [];



	for (var i = 0, len = str.length, c = str[i], s = ""; i < len; i++){
		s += c;

		// if character is new-line
		if (c == '\n') {
			line.push(s);
			s = "";
		}
	}

	alert(lines[1]);


}

