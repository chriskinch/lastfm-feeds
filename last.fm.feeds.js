/*
 *  My Last FM Plugin - v1.0
 *  https://github.com/chriskinch/lastfm_widget
 *
 *  Made by Christopher Kinch
 *  Under MIT License
 */

;(function ( $, window, document, undefined ) {


	//user (Required) : The user name to fetch top albums for.
	//api_key (Required) : A Last.fm API key.
	//type (Required) : The type of API to call.
	//limit (Optional) : The number of results to fetch per page. Defaults to 10.
	//size (Optional) : The size of the albumb art to return.
	//period (Optional) : overall | 7day | 1month | 3month | 6month | 12month - The time period over which to retrieve top albums for.
	//recent (Optional) : jQuery element to return the now playing or last played track.


	$.myLastFM = function(element, user, api_key, type, options) {
		//Constructing config and defaults
		var defaults = {
			limit:			'10',
			size:			64,
			period:			'1month',
			cover:			true,
			album:			true,
			artist:			true,
			plays:			true,
			date: 			true,
			recent: 		true,
			playing: 		true,
		}
		var config = {}

		// to avoid confusions, use "plugin" to reference the
	  // current instance of the object
	  var plugin = this;

	  var $element = $(element), // reference to the jQuery version of DOM element
				element = element;    // reference to the actual DOM element

		plugin.init = function () {
			$element.trigger("init");
			// the plugin's final properties are the merged default and
			// user-provided options (if any)
			plugin.settings = $.extend({}, defaults, options);

			plugin.config = config;
			plugin.config.image_key = getImageKey(plugin.settings.size);
			plugin.config.gettopalbums = {
				url: 'http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&format=json&callback=?',
				params: {
					user: user,
					api_key: api_key,
					limit: plugin.settings.limit,
					size: plugin.settings.size,
					period: plugin.settings.period,
				}
			}
			plugin.config.getrecenttracks = {
				url: 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&callback=?',
				params: {
					user: user,
					api_key: api_key,
					limit: plugin.settings.limit,
				}
			}

			//JSON load
			switch( type ) {
				case 'gettopalbums':
					$element.trigger("getjson");
					plugin.getJSON(type, plugin.getTopAlbums);
					break;
				case 'getrecenttracks':
					$element.trigger("getjson");
					plugin.getJSON(type, plugin.getRecentTracks);
					break;
				case 'getnowplaying':
					$element.trigger("getjson");
					plugin.config.getrecenttracks.params.limit = 1;
					plugin.getJSON('getrecenttracks', plugin.getNowPlaying);
					break;
				default:
					console.log('No feed specified.');
			}
		}

		plugin.getJSON = function( type, method ) {
			$.getJSON(plugin.config[type].url, plugin.config[type].params)
				.done(function( data ){
					method( data );
				})
				.fail(function() {
			    console.log( "Error loading JSON feed for '" + type + "'." );
			  });
		}

		plugin.getTopAlbums = function ( data ) {
			$element.trigger("jsonloaded");

			ol = $('<ol></ol>');

			$.each(data.topalbums.album, function(key, value) {
				var classes = setClassesArray('album-item', key, plugin.settings.limit);
				var title = value.artist.name + '-' + value.name + ', played ' + value.playcount + ' times';

				li = $('<li></li>')
					.attr('title', title)
					.attr('class', classes)
					.appendTo(ol);
				a = $('<a></a>')
					.attr('href', value.url)
					.attr('target', '_blank')
					.appendTo(li);
				if( plugin.settings.cover ) image = $('<img></img>')
					.attr('src', value.image[plugin.config.image_key]['#text'])
					.attr('class', 'cover')
					.attr('width', plugin.settings.size)
					.attr('height', plugin.settings.size)
					.appendTo(a);
				info = $('<span></span>')
					.attr('class', 'info')
					.appendTo(a);
				if(plugin.settings.artist) 		$('<span class="artist">' + value.artist.name + '</span>').appendTo(info);
				if(plugin.settings.album) 		$('<span class="album">' + value.name + '</span>').appendTo(info);
				if(plugin.settings.plays) 		$('<span class="plays">' + value.playcount + '<span> Plays</span></span>').appendTo(info);

				// Write to the DOM
				$element.trigger("attachelement");
				ol.appendTo($element);
				$element.trigger("elementattached");
			});
		}

		plugin.getRecentTracks = function ( data ) {
			$element.trigger("jsonloaded");

			var listening = data.recenttracks.track[0]['@attr'];
			if(!plugin.settings.playing && listening) {
				data.recenttracks.track.shift();
			} else {
				var nowplaying = (listening) ? 'listening' : null;
				$element.addClass(nowplaying);
			}

			ol = $('<ol></ol>');

			$.each(data.recenttracks.track, function(key, value) {
				var when = (value.date) ? ', played ' + timeAgo(value.date) : '';
				var classes = setClassesArray('track-item', key, (listening) ? Number(plugin.settings.limit)+1 : plugin.settings.limit);
				var title = value.artist['#text'] + '-' + value.album['#text'] + '-' + value.name + when;
				var playing = (value['@attr']) ? 'playing' : null;

				li = $('<li></li>')
					.attr('title', title)
					.attr('class', classes)
					.addClass( playing )
					.appendTo(ol);
				a = $('<a></a>')
					.attr('href', value.url)
					.attr('target', '_blank')
					.appendTo(li);
				if( plugin.settings.cover ) image = $('<img></img>')
					.attr('src', value.image[plugin.config.image_key]['#text'])
					.attr('class', 'cover')
					.attr('width', plugin.settings.size)
					.attr('height', plugin.settings.size)
					.appendTo(a);
				info = $('<span></span>')
					.attr('class', 'info')
					.appendTo(a);
				if(plugin.settings.artist) 				$('<span class="artist">' + value.artist['#text'] + '</span>').appendTo(info);
				if(plugin.settings.album) 				$('<span class="album">' + value.album['#text'] + '</span>').appendTo(info);
				if(plugin.settings.artist) 				$('<span class="track">' + value.name + '</span>').appendTo(info);
				if(plugin.settings.date && when)	$('<span class="date">' + when + '</span>').appendTo(info);

				// Write to the DOM
				$element.trigger("attachelement");
				ol.appendTo($element);
				$element.trigger("elementattached");
			});
		}

		plugin.getNowPlaying = function ( data ) {
			$element.trigger("jsonloaded");

			var value = (data.recenttracks.track[0]) ? data.recenttracks.track[0] : data.recenttracks.track;
			var listening = (value['@attr']) ? value['@attr'] : null;
			var nowplaying = (listening) ? 'listening' : null;
			$element.addClass(nowplaying);

			div = $('<div></div>');
			a = $('<a></a>')
				.attr('href', value.url)
				.attr('target', '_blank')
				.appendTo(div);
			if( plugin.settings.cover ) image = $('<img></img>')
				.attr('src', value.image[plugin.config.image_key]['#text'])
				.attr('class', 'cover')
				.attr('width', plugin.settings.size)
				.attr('height', plugin.settings.size)
				.appendTo(a);
			info = $('<span></span>')
				.attr('class', 'info')
				.appendTo(a);
			if(plugin.settings.artist) 		$('<span class="artist">' + value.artist['#text'] + '</span>').appendTo(info);
			if(plugin.settings.album) 		$('<span class="album">' + value.album['#text'] + '</span>').appendTo(info);
			if(plugin.settings.artist) 		$('<span class="track">' + value.name + '</span>').appendTo(info);

			// Write to the DOM
			if(plugin.settings.recent || listening) {
				$element.trigger("attachelement");
				div.appendTo($element);
				$element.trigger("elementattached");
			}
		}

		var getImageKey = function (size) {
			var index = (size<=34) ? 0 : (size <= 64) ? 1 : (size <= 126) ? 2 : 3;
			return index;
		}

		var setClassesArray = function (item, key, limit) {
			var first = (key == 0) ? 'first' : '';
			var last = (key == limit-1) ? 'last' : '';
			var classes_array = [item, first, last];
			var classes = classes_array.clean('').join(" ").trim();

			return classes;
		}

		var timeAgo = function(date){
			var m = 60;
			var h = m * 60;
			var d = new Date();
			var n = d.getTime();
			var now = String(n).substr(0,date.uts.length);
			var elapsed = now - date.uts;
			var elapsed_string = 	(elapsed/m < 60) ? Math.round(elapsed/m) + ' minute' : (elapsed/h < 24) ? Math.round(elapsed/h) + ' hour' : null;
			var plural = (elapsed > 1) ? 's' : '';

			var when = (elapsed_string) ? elapsed_string + plural + ' ago' : date['#text'];
			return when;
		}

		// Run initializer
		plugin.init();
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn.myLastFM = function ( user, api_key, type, options ) {
			this.each(function() {
					if (!$(this).data('myLastFM')) {
						var plugin = new $.myLastFM(this, user, api_key, type, options);
						$(this).data('pluginName', plugin);
					}
			});

			// chain jQuery functions
			return this;
	};

	String.prototype.cleanup = function() {
	  return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
	};

	Array.prototype.clean = function(del) {
	  for (var i = 0; i < this.length; i++) {
	    if (this[i] == del) {
	      this.splice(i, 1);
	      i--;
	    }
	  }
	  return this;
	};

})( jQuery, window, document );
