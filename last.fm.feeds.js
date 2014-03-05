/*
 *  jQuery Boilerplate - v3.3.2
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */

;(function ( $, window, document, undefined ) {
	//Constructing settings and defaults
	var myLastFM =	'mylastfm',
									defaults = {
										user:			'chriskinch',
										api_key:	'de5f3c80c1116bc51987f9aebc9fc3e9',
										limit:		'20',
										size:			120,
										period:		'1month',
										recent:		'1',
									},
									config = {
										image_key: 2,
									};

	// The plugin constructor
	function Plugin ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this.config = config;
			this._name = myLastFM;
			this.init();
	}

	Plugin.prototype = {
		init: function () {
				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like so: this.yourOtherFunction(this.element, this.settings).

				var base = this;
				var settings = this.settings;
				this.config.image_key = this.getImageKey(this.settings.size);

				//getTopAlbums JSON load
				$.getJSON('http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&format=json&callback=?', settings).done(function( data ){
					base.getTopAlbums( data, settings );
				});

				//getRecentTracks JSON load
				$.getJSON('http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&callback=?', settings).done(function( data ){
					base.getRecentTracks( data, settings );
				});
		},
		getTopAlbums: function ( data, settings ) {
			//Keep scope
			var base = this;

			ol = $('<ol></ol>').appendTo('#lastfmrecords .albums');

			$(data.topalbums.album).each(function(index) {
				var album_id 				= 'album-' + (index+1);
				var album_first 		= (index == 0) ? ' first' : '';
				var album_last 			= (index+1 == settings.limit) ? ' last' : '';

				var classes_array 	= 'album ' + album_id + album_first + album_last;
				var lfm_artist			= data.topalbums.album[index].artist.name;
				var lfm_album				= data.topalbums.album[index].name;
				var lfm_plays				= data.topalbums.album[index].playcount;
				var lfm_href				= data.topalbums.album[index].url;
				var lfm_image				= data.topalbums.album[index].image[base.config.image_key]['#text'];

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
					.attr('width', settings.size)
					.attr('height', settings.size)
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
		},
		getRecentTracks: function ( data, settings ) {
			//Keep scope
			var base = this;

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
			var lfm_image		= selected_data.image[base.config.image_key]['#text'];

			$('<img></img>').attr('src', lfm_image).attr('class', 'cover').appendTo($('.playing'));
			$('<span class="track"><label>' + lfm_label + '</label> ' + lfm_track + '</span>').appendTo($('.playing .inner'));
			$('<span class="artist"><label>From:</label> ' + lfm_album + ' <label>by:</label> ' +  lfm_artist + '</span>').appendTo($('.playing .inner'));
		},
		getImageKey: function (size) {
			var index = (size<=34) ? 0 : (size <= 64) ? 1 : (size <= 126) ? 2 : 3;
			return index;
		}
	};

	String.prototype.cleanup = function() {
	   return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ myLastFM ] = function ( options ) {
			this.each(function() {
					if (!$.data( this, "plugin_" + myLastFM)) {
							$.data( this, "plugin_" + myLastFM,
							new Plugin( this, options ));
					}
			});

			// chain jQuery functions
			return this;
	};

})( jQuery, window, document );
