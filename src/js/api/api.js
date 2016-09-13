var G = 'GET';
//var P = 'POST';

var API = {
	tracksGet: function(frag, cb, data) {
		this.XHR(frag, G, cb, JSON.stringify(data));
	},

	XHR: function(frag, method, cb, data) {
	    var xhr = new XMLHttpRequest();
	    xhr.addEventListener('load', function(data) {
			cb(JSON.parse(data.currentTarget.responseText));
	    });
	    console.log('http://ws.audioscrobbler.com/2.0/?' + frag);
	    xhr.open(method, 'http://ws.audioscrobbler.com/2.0/?' + frag, true);
	    xhr.setRequestHeader('Accept', 'application/json');
	    xhr.send();

	    return xhr;
	},
	
	generateQueryString: function(obj) {
		var str = [];
		for(var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
		return str.join('&');
	}
};

module.exports = API;