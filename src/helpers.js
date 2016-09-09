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

function extend() {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false,
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        push = Array.prototype.push,
        slice = Array.prototype.slice,
        trim = String.prototype.trim,
        indexOf = Array.prototype.indexOf,
        class2type = {
          "[object Boolean]": "boolean",
          "[object Number]": "number",
          "[object String]": "string",
          "[object Function]": "function",
          "[object Array]": "array",
          "[object Date]": "date",
          "[object RegExp]": "regexp",
          "[object Object]": "object"
        },
        jQuery = {
          isFunction: function (obj) {
            return jQuery.type(obj) === "function"
          },
          isArray: Array.isArray ||
          function (obj) {
            return jQuery.type(obj) === "array"
          },
          isWindow: function (obj) {
            return obj != null && obj == obj.window
          },
          isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj)
          },
          type: function (obj) {
            return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
          },
          isPlainObject: function (obj) {
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
              return false
            }
            try {
              if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false
              }
            } catch (e) {
              return false
            }
            var key;
            for (key in obj) {}
            return key === undefined || hasOwn.call(obj, key)
          }
        };
      if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }
      if (typeof target !== "object" && !jQuery.isFunction(target)) {
        target = {}
      }
      if (length === i) {
        target = this;
        --i;
      }
      for (i; i < length; i++) {
        if ((options = arguments[i]) != null) {
          for (name in options) {
            src = target[name];
            copy = options[name];
            if (target === copy) {
              continue
            }
            if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && jQuery.isArray(src) ? src : []
              } else {
                clone = src && jQuery.isPlainObject(src) ? src : {};
              }
              // WARNING: RECURSION
              target[name] = extend(deep, clone, copy);
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
      return target;
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