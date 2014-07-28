String.prototype.cleanup = function() {
	return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
};

Array.prototype.clean = function(del) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === del) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};

function setClassesArray(item, key, limit) {
	var first = (key === 0) ? 'first' : '';
	var last = (key === limit-1) ? 'last' : '';
	var classes_array = [item, first, last];
	var classes = classes_array.clean('').join(' ').trim();

	return classes;
}

function timeAgo(date){
	var m = 60;
	var h = m * 60;
	var d = new Date();
	var n = d.getTime();
	var now = String(n).substr(0,date.uts.length);
	var elapsed = now - date.uts;
	var elapsed_string = (elapsed/m < 60) ? Math.round(elapsed/m) + ' minute' : (elapsed/h < 24) ? Math.round(elapsed/h) + ' hour' : null;
	var plural = (elapsed > 1) ? 's' : '';

	var when = (elapsed_string) ? elapsed_string + plural + ' ago' : date['#text'];
	return when;
}

/**
* Helper function for iterating over a collection
*
* @param list
* @param fn
*/
function each(list, fn) {
	for (var key in list) {
		if( list.hasOwnProperty(key) ) {
			cont = fn(key, list[key]);
			if(cont === false) {
				break; //allow early exit
			}
		}
	}
}

function extend(){
	for(var i=1; i<arguments.length; i++)
		for(var key in arguments[i])
			if(arguments[i].hasOwnProperty(key))
				arguments[0][key] = arguments[i][key];
	return arguments[0];
}

/**
* Helper function for turning object into a string of params
*
* @param obj
*/
function objToParams(obj) {
	var str = "";
	for (var key in obj) {
		if (str !== "") {
			str += "&";
		}
		str += key + "=" + obj[key];
	}
	return str;
}

/**
 * CustomEvent polyfill
 */
if (typeof window.CustomEvent !== 'function') {
  (function() {
    function CustomEvent(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
     }

    window.CustomEvent = CustomEvent;

    CustomEvent.prototype = window.CustomEvent.prototype;
  })();
}