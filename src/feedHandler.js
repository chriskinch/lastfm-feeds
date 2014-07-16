/*
 *  Last FM Feeds - v1.1
 *  https://github.com/chriskinch/lastfm_widget
 *
 *  Made by Christopher Kinch
 *  Under MIT License
 */

 // All currently instantiated instances of feeds
var ALL_INSTANCES = [];

function feedHandler( element, settings ) {
	this.element = element;
	this.settings = settings;
	console.log( settings );
	this.status = null;
}


//user (Required) : The user name to fetch top albums for.
//api_key (Required) : A Last.fm API key.
//type (Required) : The type of API to call.
//limit (Optional) : The number of results to fetch per page. Defaults to 10.
//size (Optional) : The size of the albumb art to return.
//period (Optional) : overall | 7day | 1month | 3month | 6month | 12month - The time period over which to retrieve top albums for.
//recent (Optional) : jQuery element to return the now playing or last played track.


feedHandler.prototype = {

	setup: function( data ){
		// Grab the object key name
		var type = Object.keys( data )[ 0 ];

		// Call the corresponding function
		this[ type + "Render" ]( data );
	},

	topalbumsRender: function( data ){
			var self = this;

			var ol = $('<ol></ol>');

			$.each(data.topalbums.album, function(key, value) {
				var classes = setClassesArray('album-item', key, self.settings.limit);
				var title = value.artist.name + '-' + value.name + ', played ' + value.playcount + ' times';

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
				if(self.settings.artist)$('<span class="artist">' + value.artist.name + '</span>').appendTo(info);
				if(self.settings.album)	$('<span class="album">' + value.name + '</span>').appendTo(info);
				if(self.settings.plays)	$('<span class="plays">' + value.playcount + '<span> Plays</span></span>').appendTo(info);

				// Write to the DOM
				self.element.trigger('attachelement');
				ol.appendTo(self.element);
				self.element.trigger('elementattached');
			});
	},

	recenttracksRender: function( data ){
		//console.log('building tracks');
	},

	nowplayingRender: function( data ){
		//console.log('building playing');
	},

	getImageKey: function ( size ) {
		var index = (size<=34) ? 0 : (size <= 64) ? 1 : (size <= 126) ? 2 : 3;
		return index;
	}
	
};
