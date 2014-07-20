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
  * @param {Object} options.limit: The number of results to fetch per page. Defaults to 10.
  * @param {Object} options.size: The size of the albumb art to return.
  * @param {Object} options.period: The time period over which to retrieve top albums for (e.g: overall|7day|1month|3month|6month|12month)
  * @param {Object} options.cover: Toggles the rendering of the cover image
  * @param {Object} options.album: Toggles the rendering of the album name
  * @param {Object} options.artist: Toggles the rendering of the artist name
  * @param {Object} options.plays: Toggles the rendering of the play count
  * @param {Object} options.date: Toggles the rendering of the date played
  * @param {Object} options.playing: Toggles the rendering of the current playing track (note: user.getrecenttracks only)
  */

  // All currently instantiated instances of feeds
  var ALL_INSTANCES = [];

  function feedLoader() {
  	if (!jQuery) {
  		throw new Error('jQuery is not present, please load it before calling any methods');
  	}
  }

  feedLoader.prototype = {

  	init: function( selector, user, api_key, method, options ){
  		// reference to the jQuery version of DOM element
  		var element = $(selector);

  		// Setup variables and defaults
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

  		// Final properties and options are merged to default
  		this.settings = $.extend({}, defaults, options);

  		var url = 'http://ws.audioscrobbler.com/2.0/?',
  			params = {
  				method:	method,
  				format:	'json',
  				user: user,
  				api_key: api_key,
  				limit: this.settings.limit,
  				size: this.settings.size,
  				period: this.settings.period,
  				callback: '',
  			};
  		
  		//JSON load
  		element.trigger('init');
  		this.loadFeed(element, url, params, this.settings);

  	},

  	loadFeed: function( element, url, params, settings){
  		var self = this;

  		element.trigger('getjson');

  		$.getJSON(url, params)
  		.done(function( data ){
  			element.trigger('jsonloaded');
  			var handler = new feedHandler( element, settings );
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

  function feedHandler( element, settings ) {
  	this.element = element;
  	this.settings = settings;
  	this.status = null;
  }

  feedHandler.prototype = {

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
  		self.element.trigger('attachelement');
  		ol.appendTo(self.element);
  		self.element.trigger('elementattached');

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

  return new feedLoader();

}));
