(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    }
    else if(typeof define === 'function' && define.amd) {
        define('lastfmfeeds', ['jquery'], factory);
    }
    else {
        root['lastfmfeeds'] = factory(root.jquery);
    }
}(this, function(jquery) {

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
  }


  //user (Required) : The user name to fetch top albums for.
  //api_key (Required) : A Last.fm API key.
  //type (Required) : The type of API to call.
  //limit (Optional) : The number of results to fetch per page. Defaults to 10.
  //size (Optional) : The size of the albumb art to return.
  //period (Optional) : overall | 7day | 1month | 3month | 6month | 12month - The time period over which to retrieve top albums for.
  //recent (Optional) : jQuery element to return the now playing or last played track.


  feedLoader.prototype = {

  	init: function( selector, user, api_key, method, options ){
  		var element = $(selector);

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

  		var config = {
  			url: 'http://ws.audioscrobbler.com/2.0/?',
  			params: {
  				method:	method,
  				format:	'json',
  				user: user,
  				api_key: api_key,
  				limit: this.settings.limit,
  				size: this.settings.size,
  				period: this.settings.period,
  				callback: '',
  			}
  		};
  		
  		//JSON load
  		element.trigger('getjson');
  		this.loadFeed(element, config.url, config.params);

  	},

  	loadFeed: function( element, url, params ){
  		var self = this;
  		$.getJSON(url, params)
  		.done(function( data ){
  			element.trigger('jsonloaded');
  			var handler = new feedHandler( element, self.settings );
  				handler.setup( data );
  		})
  		.fail(function() {
  			console.log( 'Error loading JSON feed.' );
  		});
  	}

  };
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
  String.prototype.cleanup = function() {
  	return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
  };

  Array.prototype.clean = function(del) {
  	for (var i = 0; i < this.length; i++) {
  		if (this[i] === del) {
  			this.splice(i, 1);
  			i--;
  		}
  	}
  	return this;
  };

  var setClassesArray = function (item, key, limit) {
  	var first = (key === 0) ? 'first' : '';
  	var last = (key === limit-1) ? 'last' : '';
  	var classes_array = [item, first, last];
  	var classes = classes_array.clean('').join(' ').trim();

  	return classes;
  };

  var timeAgo = function(date){
  	var m = 60;
  	var h = m * 60;
  	var d = new Date();
  	var n = d.getTime();
  	var now = String(n).substr(0,date.uts.length);
  	var elapsed = now - date.uts;
  	var elapsed_string = (elapsed/m < 60) ? Math.round(elapsed/m) + ' minute' : (elapsed/h < 24) ? Math.round(elapsed/h) + ' hour' : null;
  	var plural = (elapsed > 1) ? 's' : '';

  	var when = (elapsed_string) ? elapsed_string + plural + ' ago' : date['#text'];
  	return when;
  };

  return new feedLoader();

}));
