/*
 *  My Last FM Plugin - v1.0
 *  https://github.com/chriskinch/lastfm_widget
 *
 *  Made by Christopher Kinch
 *  Under MIT License
 */

;(function ( $, window, document, undefined ) {


	$.myLastFM = function(element, user, api_key, options) {
		//Constructing config and defaults
		var defaults = {
			limit:		'20',
			size:			120,
			period:		'1month',
			recent:		'1',
		}
		var config = {}

		// to avoid confusions, use "plugin" to reference the
	  // current instance of the object
	  var plugin = this;

	  var $element = $(element), // reference to the jQuery version of DOM element
				element = element;    // reference to the actual DOM element

		plugin.init = function () {
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
					limit: plugin.settings.recent,
				}
			}

			//getTopAlbums JSON load
			$.getJSON(plugin.config.gettopalbums.url, plugin.config.gettopalbums.params).done(function( data ){
				plugin.getTopAlbums( data );
			});

			//getRecentTracks JSON load
			$.getJSON(plugin.config.getrecenttracks.url, plugin.config.getrecenttracks.params).done(function( data ){
				plugin.getRecentTracks( data );
			});
		}

		plugin.getTopAlbums = function ( data ) {
			ol = $('<ol></ol>').appendTo('#lastfmrecords .albums');

			$(data.topalbums.album).each(function(index) {
				var album_id 				= 'album-' + (index+1);
				var album_first 		= (index == 0) ? ' first' : '';
				var album_last 			= (index+1 == plugin.settings.limit) ? ' last' : '';

				var classes_array 	= 'album ' + album_id + album_first + album_last;
				var lfm_artist			= data.topalbums.album[index].artist.name;
				var lfm_album				= data.topalbums.album[index].name;
				var lfm_plays				= data.topalbums.album[index].playcount;
				var lfm_href				= data.topalbums.album[index].url;
				var lfm_image				= data.topalbums.album[index].image[plugin.config.image_key]['#text'];

				li = $('<li></li>')
					.attr('id', lfm_album.cleanup())
					.attr('class', classes_array)
					.appendTo(ol);

				link = $('<a></a>')
					.attr('href', lfm_href)
					.attr('target', '_blank')
					.appendTo(li);

				images = $('<img></img>')
					.attr('src', lfm_image)
					.attr('width', plugin.settings.size)
					.attr('height', plugin.settings.size)
					.appendTo(link);

				info = $('<span></span>')
					.attr('class', 'info')
					.appendTo(link);

				inner = $('<span></span>')
					.attr('class', 'inner')
					.appendTo(info);

				$('<span class="artist"><label>Artist:</label> ' + lfm_artist + '</span>').appendTo(inner);
				$('<span class="album"><label>Album:</label> ' + lfm_album + '</span>').appendTo(inner);
				$('<span class="plays">' + lfm_plays + ' <span>Plays</span></span>').appendTo(inner);
			});
		}

		plugin.getRecentTracks = function ( data ) {
			if(data.recenttracks.track[0]) {
				var selected_data = data.recenttracks.track[0];
				var lfm_label	= 'Listening to:';
				$('.eq .graph').addClass('animated');
			} else {
				var selected_data = data.recenttracks.track;
				var lfm_label	= 'Recently played:';
			}

			var lfm_artist 	= selected_data.artist['#text'];
			var lfm_album		= selected_data.album['#text'];
			var lfm_track		= selected_data.name;
			var lfm_image		= selected_data.image[plugin.config.image_key]['#text'];

			$('<img></img>').attr('src', lfm_image).attr('class', 'cover').appendTo($('.playing'));
			$('<span class="track"><label>' + lfm_label + '</label> ' + lfm_track + '</span>').appendTo($('.playing .inner'));
			$('<span class="artist"><label>From:</label> ' + lfm_album + ' <label>by:</label> ' +  lfm_artist + '</span>').appendTo($('.playing .inner'));
		}

		var getImageKey = function (size) {
			var index = (size<=34) ? 0 : (size <= 64) ? 1 : (size <= 126) ? 2 : 3;
			return index;
		}

		// Run initializer
		plugin.init();
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn.myLastFM = function ( user, api_key, options ) {
			this.each(function() {
					if (!$(this).data('myLastFM')) {
						var plugin = new $.myLastFM(this, user, api_key, options);
						$(this).data('pluginName', plugin);
					}
			});

			// chain jQuery functions
			return this;
	};

	String.prototype.cleanup = function() {
	  return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
	};

})( jQuery, window, document );
