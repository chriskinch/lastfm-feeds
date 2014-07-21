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
