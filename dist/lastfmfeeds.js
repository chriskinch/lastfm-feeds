(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define('lastfmfeeds', [], factory);
    }
    else {
        root['lastfmfeeds'] = factory();
    }
}(this, function() {

  /*
   * Controls the setup and JSON loading of each feed.
  	* @param {Function} feedLoader
  * @param {Function} feedLoader.init (Required)
  *
  * @param {String} selector: ID or class that will contain the feed
  * @param {String} user: The user name to fetch top albums for.
  * @param {String} api_key: Your Last.fm API key.
  * @param {String} method: The type of API to call to be made. (e.g: user.gettopalbums|user.getrecenttracks)
  *
  * @param {Object} options: Options object (Optional) 
  * @param {Number} options.limit: The number of results to fetch per page. Defaults to 10.
  * @param {Number} options.size: The size of the albumb art to return.
  * @param {String} options.period: The time period over which to retrieve top albums for (e.g: overall|7day|1month|3month|6month|12month)
  * @param {Boolean} options.cover: Toggles the rendering of the cover image
  * @param {Boolean} options.album: Toggles the rendering of the album name
  * @param {Boolean} options.artist: Toggles the rendering of the artist name
  * @param {Boolean} options.plays: Toggles the rendering of the play count
  * @param {Boolean} options.date: Toggles the rendering of the date played
  * @param {Boolean} options.playing: Toggles the rendering of the current playing track (note: user.getrecenttracks only)
  */

  // All currently instantiated instances of feeds
  var ALL_INSTANCES = {};

  function Feed() {}

  Feed.prototype = {

  	init: function( selector, user, api_key, method, options ){
  		var instance = {};
  		// reference to the jQuery version of DOM element.
  		instance.selector = selector;
  		instance.element = document.querySelectorAll(selector)[0];

  		// Setup variables and defaults.
  		var defaults = {
  			limit:		10,
  			size:		64,
  			period:		'1month',
  			cover:		true,
  			album:		true,
  			artist:		true,
  			plays:		true,
  			date:		true,
  			playing:	true,
  		};

  		// Final properties and options are merged to default.
  		instance.settings = extend({}, defaults, options);  //TO DO

  		// Setting up JSOM config from provided params and settings.
  		instance.config = {
  			url:'http://ws.audioscrobbler.com/2.0/?',
  			params: {
  				method:	method,
  				format:	'json',
  				user: user,
  				api_key: api_key,
  				limit: instance.settings.limit,
  				size: instance.settings.size,
  				period: instance.settings.period,
  				callback: '',
  			}
  		};
  		
  		//JSON load
  		var evt = new CustomEvent('lastfmfeeds:init');
  		window.dispatchEvent(evt);

  		var feed = new FeedLoader( instance.element, instance.settings );
  			feed.loadFeed( instance.config.url, instance.config.params );

  		// Saving instance to array for later use.
  		ALL_INSTANCES[selector] = instance;
  	},

  	destroy: function( selectors ) {
  		// Loop through selectors provided. If undefined destroy all.
  		if(selectors === undefined) selectors = Object.keys(ALL_INSTANCES);

  		each(selectors, function(index, value) {
  			var instance = ALL_INSTANCES[value];
  			var element = document.querySelectorAll(value);
  			if(instance !== undefined) {
  				var evt = new CustomEvent('lastfmfeeds:destroy');
  				window.dispatchEvent(evt);
  				element[0].innerHTML = null;
  				delete ALL_INSTANCES[value];
  			}
  		});
  	},

  	refresh: function( selectors ) {
  		var self = this;
  		// Loop through selectors provided. If null refresh all.
  		if(selectors === undefined) selectors = Object.keys(ALL_INSTANCES);
  		
  		each(selectors, function(index, value) {
  			var instance = ALL_INSTANCES[value];
  			var element = document.querySelectorAll(value);
  			if(instance !== undefined) {
  				var evt = new CustomEvent('lastfmfeeds:refresh');
  				window.dispatchEvent(evt);
  				var feed = new FeedLoader( element, instance.settings );
  					feed.loadFeed( instance.config.url, instance.config.params );
  				self.destroy([value]);
  				ALL_INSTANCES[value] = instance;
  			}
  		});
  	},

  	update: function( selector, options) {
  		var instance = ALL_INSTANCES[selector];
  		var defaults = instance.settings;
  		// Final properties and options are merged to default.
  		instance.settings = extend({}, defaults, options);
  		var evt = new CustomEvent('lastfmfeeds:update');
  		window.dispatchEvent(evt);
  		this.refresh([selector]);
  	},

  	feeds: function() {
  		return ALL_INSTANCES;
  	}

  };
  /*
   * Controls the setup and JSON loading of each feed.
  	* @param {Function} feedLoader
  * @param {Function} feedLoader.init (Required)
  *
  * @param {String} selector: ID or class that will contain the feed
  */



  function FeedLoader( element, settings ) {
  	this.element = element;
  	this.settings = settings;
  	this.status = null;
  }

  FeedLoader.prototype = {

  	loadFeed: function( url, params ){
  		var self = this;

  		var evt = new CustomEvent('lastfmfeeds:getjson');
  		window.dispatchEvent(evt);

  		// GET the JSON feed using XMLHttpRequest
  		try {
  			var xhr = new XMLHttpRequest();
  			var prm = objToParams(params); // Convert our param object into a string
  			xhr.onreadystatechange = function() {
  				if (xhr.readyState == 4) {
  					var handler = new FeedHandler( self.element, self.settings );
  						handler.setup( JSON.parse(xhr.response) ); // The response comes as a string so we convert it to JSON
  				}
  			};
  			xhr.open("GET", url + prm, true); // Async is true
  			xhr.send(null);
  		} catch (e) {
  			console.log( 'Last.fm Feeds: Error loading JSON feed.' );
  			console.log(e);
  		}
  	}

  };
  /*
   * Handles the setup and HTML rendering of the feeds.
   *
   * @param {Function} feedHandler
   * @param {Object} feedHandler.element: The jQuery element that hold the feed
   * @param {Object} feedHandler.settings: Defines all of the settings associated with a feed
   * @param {Boolean} feedHandler.status: Maintains the current status of a feed
   */

  function FeedHandler( element, settings ) {
  	this.element = element;
  	this.settings = settings;
  	this.status = null;
  }

  FeedHandler.prototype = {

  	setup: function( data ){
  		// Grab the object key name
  		var type = Object.keys( data )[ 0 ],
  			feed = null;

  		// Choose the correct object depending on the JSON returned
  		switch( type ) {
  			case 'topalbums':
  				feed = data[type].album;
  				break;
  			case 'recenttracks':
  				feed = data[type].track;
  				break;
  			default:
  				console.log( 'Last.fm Feeds: Unrecognized feed.' );
  		}

  		this.render( type, feed );
  	},

      render: function( type, feed ) {
  		var self = this, // Register 'this' to keep scope
  			classes, when, title, playing = null,
  			fragment = document.createDocumentFragment(),
  			ol = document.createElement("ol"),
  			li, a, info, artist, album, plays, track, date, listening, nowplaying;

  		fragment.appendChild(ol);

  		each(feed, function(key, val) {
  			var group = [];

  			switch( type ) {
  				case 'topalbums':
  					classes = setClassesArray('item', key, self.settings.limit);
  					title = val.artist.name + '-' + val.name + ', played ' + val.playcount + ' times';

  					group.push( self.buildDOMElement("span", {'className': 'artist', 'innerHTML':val.artist.name}, self.settings.artist) );
  					group.push( self.buildDOMElement("span", {'className': 'album', 'innerHTML':val.name}, self.settings.album ) );
  					group.push( self.buildDOMElement("span", {'className': 'plays', 'innerHTML':val.playcount}, self.settings.plays) );
  					break;
  				case 'recenttracks':
  					listening = feed[0]['@attr'];
  					if(!self.settings.playing && listening) feed.shift();
  					if(listening) self.element.className = 'listening';
  					
  					when = (val.date) ? ', played ' + timeAgo(val.date) : '';
  					classes = setClassesArray('item', key, (listening) ? Number(self.settings.limit)+1 : self.settings.limit);
  					title = val.artist['#text'] + '-' + val.album['#text'] + '-' + val.name + when;
  					playing = (val['@attr']) ? 'playing' : null;

  					group.push( self.buildDOMElement("span", {'className': 'artist', 'innerHTML':val.artist['#text']}, self.settings.artist) );
  					group.push( self.buildDOMElement("span", {'className': 'artist', 'innerHTML':val.album['#text']}, self.settings.album) );
  					group.push( self.buildDOMElement("span", {'className': 'track', 'innerHTML':val.name}, self.settings.track) );
  					group.push( self.buildDOMElement("span", {'className': 'date', 'innerHTML':when}, self.settings.date) );
  					break;
  				default:
  					console.log( 'Last.fm Feeds: Unrecognized type.' );
  			}

  			li = self.buildDOMElement("li", {'title': title, 'className':classes});
  			ol.appendChild(li);

  			link = self.buildDOMElement("a", {'href': val.url, 'target':'_blank'});
  			li.appendChild(link);

  			var src = val.image[self.getImageKey(self.settings.size)]['#text'],
  				img = self.buildDOMElement("img", {'src': src, 'className':'cover', 'width':self.settings.size, 'height':self.settings.size}, self.settings.cover);
  			link.appendChild(img);

  			info = self.buildDOMElement("span", {'className': 'info'});
  			link.appendChild(info);

  			each(group, function(i, el){
  				info.appendChild(el);
  			});
  		});

  		// Write to the DOM
  		var evt = new CustomEvent('lastfmfeeds:attachelement');
  		window.dispatchEvent(evt);
  		this.element.appendChild(fragment);
  	},

  	buildDOMElement: function(el, attrs, check) {
  		if( check !== false ) {
  			var node = document.createElement(el);
  			each(attrs, function(key, val){
  				node[key] = val;
  			});
  			return node;
  		}
  	},

  	getImageKey: function ( size ) {
  		var index = (size<=34) ? 0 : (size <= 64) ? 1 : (size <= 126) ? 2 : 3;
  		return index;
  	}
  	
  };
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

  return new Feed();

}));
