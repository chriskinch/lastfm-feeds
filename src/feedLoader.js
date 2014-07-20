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
