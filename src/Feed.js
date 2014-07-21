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

function Feed() {
	if (!jQuery) {
		throw new Error('jQuery is not present, please load it before calling any methods');
	}
}

Feed.prototype = {

	init: function( selector, user, api_key, method, options ){
		var instance = {};
		// reference to the jQuery version of DOM element
		instance.element = $(selector);

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
		instance.settings = $.extend({}, defaults, options);

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

		ALL_INSTANCES[selector] = instance;

	},

    refresh: function( selectors ) {
		var self = this;

		$.each(selectors, function(index, value) {
			var instance = ALL_INSTANCES[value];
			var element = $(value);
			element.trigger('lastfmfeeds:refresh');
			var feed = new FeedLoader( element, instance.settings );
				feed.loadFeed( instance.config.url, instance.config.params );
		});
    }

};
