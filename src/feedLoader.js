/*
 * Controls the setup and JSON loading of each feed.
	* @param {Function} feedLoader
* @param {Function} feedLoader.init (Required)
*
* @param {String} selector: ID or class that will contain the feed
*/



function FeedLoader( element, settings ) {
	this.element = element;
	this.settings = settings;
	this.status = null;
}

FeedLoader.prototype = {

	loadFeed: function( url, params ){
		var self = this;

		self.element.trigger('lastfmfeeds:getjson');

		$.getJSON(url, params)
		.done(function( data ){
			self.element.trigger('lastfmfeeds:jsonloaded');
			var handler = new FeedHandler( self.element, self.settings );
				handler.setup( data );
		})
		.fail(function() {
			console.log( 'Last.fm Feeds: Error loading JSON feed.' );
		});
	}

};
