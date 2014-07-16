/*
 *  Last FM Feeds - v1.1
 *  https://github.com/chriskinch/lastfm_widget
 *
 *  Made by Christopher Kinch
 *  Under MIT License
 */

 // All currently instantiated instances of feeds
var ALL_INSTANCES = [];

function feedLoader() {
	console.log('loader');

	if (!jQuery) {
		throw new Error('jQuery is not present, please load it before calling any methods');
	}

	this.feed = {};
}


//user (Required) : The user name to fetch top albums for.
//api_key (Required) : A Last.fm API key.
//type (Required) : The type of API to call.
//limit (Optional) : The number of results to fetch per page. Defaults to 10.
//size (Optional) : The size of the albumb art to return.
//period (Optional) : overall | 7day | 1month | 3month | 6month | 12month - The time period over which to retrieve top albums for.
//recent (Optional) : jQuery element to return the now playing or last played track.


feedLoader.prototype = {

	init: function( element, user, api_key, method, options ){
		// Setup variables and defaults
		var defaults = {
				limit: 10,
				size: 64,
				period: '1month',
				cover:		true,
				album:		true,
				artist:		true,
				plays:		true,
				date:		true,
				recent:		true,
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
		this.loadFeed(url, params, defaults);

	},

	loadFeed: function( url, params ){
		$.getJSON(url, params)
		.done(function( data ){
			var handler = new feedHandler();
				handler.buildList( data );
		})
		.fail(function() {
			console.log( 'Error loading JSON feed.' );
		});
	}

};
