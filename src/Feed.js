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
				delete ALL_INSTANCES[value];
			}
		});
	},

	refresh: function( selectors ) {
		var self = this;
		// Loop through selectors provided. If null refresh all.
		if(selectors === undefined) selectors = Object.keys(ALL_INSTANCES);
		$.each(selectors, function(index, value) {
			var instance = ALL_INSTANCES[value];
			var element = $(value);
			if(instance !== undefined) {
				element.trigger('lastfmfeeds:refresh');
				var feed = new FeedLoader( element, instance.settings );
					feed.loadFeed( instance.config.url, instance.config.params );
				self.destroy([value]);
				ALL_INSTANCES[value] = instance;
			}
		});
	},

	feeds: function() {
		return ALL_INSTANCES;
	}

};
