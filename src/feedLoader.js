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
		var data;

		var evt = new CustomEvent('lastfmfeeds:getjson');
		window.dispatchEvent(evt);

		// GET the JSON feed using XMLHttpRequest
		try {
			var xhr = new XMLHttpRequest();
			var prm = objToParams(params); // Convert our param object into a string
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					data = JSON.parse(xhr.response); // The response comes as a string so we convert it to JSON
					console.log(data);
					return data;
				}
			};
			xhr.open("GET", url + prm, true); // Async is true
			xhr.send(null);
		} catch (e) {
			console.log( 'Last.fm Feeds: Error loading JSON feed.' );
			console.log(e);
		}
	}

};
