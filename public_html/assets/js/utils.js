var stringContains = function(string, contains) {
	var ret = false;

	if (! contains instanceof Array) {
		contains = [contains];
	}

	contains.forEach(function(c) {
		if (string.toLowerCase().indexOf(c.toLowerCase()) > -1) {
			ret = true;
		}
	});

	return ret;
}
