/*
 *  Last FM Feeds - v1.1
 *  https://github.com/chriskinch/lastfm_widget
 *
 *  Made by Christopher Kinch
 *  Under MIT License
 */

 // All currently instantiated instances of feeds
var ALL_INSTANCES = [];

function feedHandler() {
	console.log('handler');

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


feedHandler.prototype = {

	buildList: function( data ){
		
		console.log( data );

	}
	

};
