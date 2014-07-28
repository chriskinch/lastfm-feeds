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

		var fragment = document.createDocumentFragment(),
			ol = document.createElement("ol"),
			li, a, info, artist, album, plays, track, date, listening, nowplaying;

		fragment.appendChild(ol);

		each(feed, function(key, val) {
			var group = [];

			switch( type ) {
				case 'topalbums':
					classes = setClassesArray('item', key, self.settings.limit);
					title = val.artist.name + '-' + val.name + ', played ' + val.playcount + ' times';

					group.push( self.buildDOMElement("span", {'className': 'artist', 'innerHTML':val.artist.name}, self.settings.artist) );
					group.push( self.buildDOMElement("span", {'className': 'album', 'innerHTML':val.name}, self.settings.album ) );
					group.push( self.buildDOMElement("span", {'className': 'plays', 'innerHTML':val.playcount}, self.settings.plays) );
					break;
				case 'recenttracks':
					listening = feed[0]['@attr'];
					if(!self.settings.playing && listening) {
						feed.shift();
					} else {
						nowplaying = (listening) ? 'listening' : null;
						if(nowplaying) self.element.className = nowplaying;
					}
					when = (val.date) ? ', played ' + timeAgo(val.date) : '';
					classes = setClassesArray('item', key, (listening) ? Number(self.settings.limit)+1 : self.settings.limit);
					title = val.artist['#text'] + '-' + val.album['#text'] + '-' + val.name + when;
					playing = (val['@attr']) ? 'playing' : null;

					group.push( self.buildDOMElement("span", {'className': 'artist', 'innerHTML':val.artist['#text']}, self.settings.artist) );
					group.push( self.buildDOMElement("span", {'className': 'artist', 'innerHTML':val.album['#text']}, self.settings.album) );
					group.push( self.buildDOMElement("span", {'className': 'track', 'innerHTML':val.name}, self.settings.track) );
					group.push( self.buildDOMElement("span", {'className': 'date', 'innerHTML':when}, self.settings.date) );
					break;
				default:
					console.log( 'Last.fm Feeds: Unrecognized type.' );
			}

			li = self.buildDOMElement("li", {'title': title, 'className':classes});
			ol.appendChild(li);

			link = self.buildDOMElement("a", {'href': val.url, 'target':'_blank'});
			li.appendChild(link);

			var src = val.image[self.getImageKey(self.settings.size)]['#text'],
				img = self.buildDOMElement("img", {'src': src, 'className':'cover', 'width':self.settings.size, 'height':self.settings.size}, self.settings.cover);
			link.appendChild(img);

			info = self.buildDOMElement("span", {'className': 'info'});
			link.appendChild(info);

			each(group, function(i, el){
				info.appendChild(el);
			});
		});

		// Write to the DOM
		var evt = new CustomEvent('lastfmfeeds:attachelement');
		window.dispatchEvent(evt);
		this.element.appendChild(fragment);
	},

	buildDOMElement: function(el, attrs, check) {
		if( check !== false ) {
			var node = document.createElement(el);
			each(attrs, function(key, val){
				node[key] = val;
			});
			return node;
		}
	},

	getImageKey: function ( size ) {
		var index = (size<=34) ? 0 : (size <= 64) ? 1 : (size <= 126) ? 2 : 3;
		return index;
	}
	
};
