(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    }
    else if(typeof define === 'function' && define.amd) {
        define('lastfmfeeds', ['jquery'], factory);
    }
    else {
        root['lastfmfeeds'] = factory(root.jquery);
    }
}(this, function(jquery) {

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
  var ALL_INSTANCES = [];

  function Feed() {
  	if (!jQuery) {
  		throw new Error('jQuery is not present, please load it before calling any methods');
  	}
  }

  Feed.prototype = {

  	init: function( selector, user, api_key, method, options ){
  		var instance = {};
  		// reference to the jQuery version of DOM element.
  		instance.selector = selector;
  		instance.element = $(selector);

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
  		instance.settings = $.extend({}, defaults, options);

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
  		instance.element.trigger('lastfmfeeds:init');
  		var feed = new FeedLoader( instance.element, instance.settings );
  			feed.loadFeed( instance.config.url, instance.config.params );

  		// Saving instance to array for later use.
  		ALL_INSTANCES[selector] = instance;

  	},

  	destroy: function( selectors ) {
  		// Loop through selectors provided. If undefined destroy all.
  		if(selectors === undefined) selectors = Object.keys(ALL_INSTANCES);
  		$.each(selectors, function(index, value) {
  			var instance = ALL_INSTANCES[value];
  			var element = $(value);
  			if(instance !== undefined) {
  				element.trigger('lastfmfeeds:destroy');
  				element.empty();
  			}
  		});
  	},

      refresh: function( selectors ) {
  		// Loop through selectors provided. If null refresh all.
  		if(selectors === undefined) selectors = Object.keys(ALL_INSTANCES);
  		this.destroy(selectors);
  		$.each(selectors, function(index, value) {
  			var instance = ALL_INSTANCES[value];
  			var element = $(value);
  			if(instance !== undefined) {
  				element.trigger('lastfmfeeds:refresh');
  				var feed = new FeedLoader( element, instance.settings );
  					feed.loadFeed( instance.config.url, instance.config.params );
  			}
  		});
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

  		self.element.trigger('lastfmfeeds:getjson');

  		$.getJSON(url, params)
  		.done(function( data ){
  			self.element.trigger('lastfmfeeds:jsonloaded');
  			var handler = new FeedHandler( self.element, self.settings );
  				handler.setup( data );
  		})
  		.fail(function() {
  			console.log( 'Last.fm Feeds: Error loading JSON feed.' );
  		});
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
  		var type = Object.keys( data )[ 0 ];
  		var feed = null;

  		// Choose the correct object depending on the JSON returned
  		switch( type ) {
  			case 'topalbums':
  				feed = data.topalbums.album;
  				break;
  			case 'recenttracks':
  				feed = data.recenttracks.track;
  				break;
  			default:
  				console.log( 'Last.fm Feeds: Unrecognized feed.' );
  		}

  		this.render( type, feed );
  	},

      render: function( type, feed ) {
  		var self = this; // Register 'this' to keep scope

  		var classes, when, title, playing = null;

  		if(type == 'recenttracks') {
  			var listening = feed[0]['@attr'];
  			if(!self.settings.playing && listening) {
  				feed.shift();
  			} else {
  				var nowplaying = (listening) ? 'listening' : null;
  				self.element.addClass(nowplaying);
  			}
  		}

  		var ol = $('<ol></ol>');

  		$.each(feed, function(key, value) {
  			switch( type ) {
  				case 'topalbums':
  					classes = setClassesArray('item', key, self.settings.limit);
  					title = value.artist.name + '-' + value.name + ', played ' + value.playcount + ' times';
  					break;
  				case 'recenttracks':
  					when = (value.date) ? ', played ' + timeAgo(value.date) : '';
  					classes = setClassesArray('track-item', key, (listening) ? Number(self.settings.limit)+1 : self.settings.limit);
  					title = value.artist['#text'] + '-' + value.album['#text'] + '-' + value.name + when;
  					playing = (value['@attr']) ? 'playing' : null;
  					break;
  				default:
  					console.log( 'Last.fm Feeds: Unrecognized type.' );
  			}

  			var li = $('<li></li>')
  				.attr('title', title)
  				.attr('class', classes)
  				.appendTo(ol);
  			var a = $('<a></a>')
  				.attr('href', value.url)
  				.attr('target', '_blank')
  				.appendTo(li);
  			if( self.settings.cover ) var image = $('<img></img>')
  				.attr('src', value.image[self.getImageKey(self.settings.size)]['#text'])
  				.attr('class', 'cover')
  				.attr('width', self.settings.size)
  				.attr('height', self.settings.size)
  				.appendTo(a);
  			var info = $('<span></span>')
  				.attr('class', 'info')
  				.appendTo(a);

  			switch( type ) {
  				case 'topalbums':
  					if(self.settings.artist)		$('<span class="artist">' + value.artist.name + '</span>').appendTo(info);
  					if(self.settings.album)			$('<span class="album">' + value.name + '</span>').appendTo(info);
  					if(self.settings.plays)			$('<span class="plays">' + value.playcount + '<span> Plays</span></span>').appendTo(info);
  					break;
  				case 'recenttracks':
  					if(self.settings.artist)		$('<span class="artist">' + value.artist['#text'] + '</span>').appendTo(info);
  					if(self.settings.album)			$('<span class="album">' + value.album['#text'] + '</span>').appendTo(info);
  					if(self.settings.artist)		$('<span class="track">' + value.name + '</span>').appendTo(info);
  					if(self.settings.date && when)	$('<span class="date">' + when + '</span>').appendTo(info);
  					break;
  				default:
  					console.log( 'Last.fm Feeds: Unrecognized type.' );
  			}			
  		});

  		// Write to the DOM
  		self.element.trigger('lastfmfeeds:attachelement');
  		ol.appendTo(self.element);
  		self.element.trigger('lastfmfeeds:elementattached');

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

  var setClassesArray = function (item, key, limit) {
  	var first = (key === 0) ? 'first' : '';
  	var last = (key === limit-1) ? 'last' : '';
  	var classes_array = [item, first, last];
  	var classes = classes_array.clean('').join(' ').trim();

  	return classes;
  };

  var timeAgo = function(date){
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
  };

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
