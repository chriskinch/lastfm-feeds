/* CHRISKINCH.COM LAST FM FEED VIEWER */
$(document).ready(function(){
	//Getting the JSON feed from Last.FM
	var settings									= new Object();
	settings.username 						= 'chriskinch';
	settings.apikey								= 'de5f3c80c1116bc51987f9aebc9fc3e9';
	
	settings.getTopAlbums					= new Object();
	settings.getTopAlbums.limit 	= '20'; //(optional): The number of results to fetch per page. Defaults to 50
	settings.getTopAlbums.period 	= '7day'; //(optional): overall | 7day | 1month | 3month | 6month | 12month
	settings.getTopAlbums.url 		= 'http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=' + settings.username +
																	'&api_key=' + settings.apikey +
																	'&limit=' + settings.getTopAlbums.limit +
																	'&period=' + settings.getTopAlbums.period +
																	'&format=json&callback=?';
																	
	settings.getRecentTracks				= new Object();																
	settings.getRecentTracks.limit 	= '1'; //(optional): The number of results to fetch per page.
	settings.getRecentTracks.url 		= 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + settings.username +
																		'&api_key=' + settings.apikey +
																		'&limit=' + settings.getRecentTracks.limit +
																		'&format=json&callback=?';
	
	//http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=rj&api_key=b25b959554ed76058ac220b7b2e0a026
	
	var config = new Object();
	config.size = 53;
	
	//choose a relavent image file size
	var image_id = getImageScale(config.size);
	
	//START - getTopAlbums JSON load
	$.getJSON(settings.getTopAlbums.url, function(data) {
		console.log(data);
		
		ol = $('<ol></ol>').appendTo('#lastfmrecords .albums');
		
		$(data.topalbums.album).each(function(index) {
			
			var album_id 				= 'album-' + (index+1);
			var album_first 		= (index == 0) ? ' first' : '';
			var album_last 			= (index+1 == settings.getTopAlbums.limit) ? ' last' : '';
			
			var classes_array 	= 'album ' + album_id + album_first + album_last;
			var lfm_artist			= data.topalbums.album[index].artist.name;
			var lfm_album				= data.topalbums.album[index].name;
			var lfm_plays				= data.topalbums.album[index].playcount;
			var lfm_href				= data.topalbums.album[index].url;
			var lfm_image				= data.topalbums.album[index].image[image_id]['#text'];
						
			li = $('<li></li>')
				.attr('id', lfm_album.cleanup())
				.attr('class', classes_array)
				.appendTo(ol);
			
			link = $('<a></a>')
				.attr('href', lfm_href)
				.attr('target', '_blank')
				.appendTo(li);
			
			images = $('<img></img>')
				.attr('src', lfm_image)
				.attr('width', config.size)
				.attr('height', config.size)
				.appendTo(link);
				
			info = $('<span></span>')
				.attr('class', 'info')
				.appendTo(link);
				
			inner = $('<span></span>')
				.attr('class', 'inner')
				.appendTo(info);
					
			$('<span class="artist"><label>Artist:</label> ' + lfm_artist + '</span>').appendTo(inner);
			$('<span class="album"><label>Album:</label> ' + lfm_album + '</span>').appendTo(inner);
			$('<span class="plays">' + lfm_plays + ' <span>Plays</span></span>').appendTo(inner);
			
			//$('.info .inner').first().text("hello");
		});
	});
	//END - getTopAlbums JSON load
	
	//START - getRecentTracks JSON load
	$.getJSON(settings.getRecentTracks.url, function(data) {
		console.log(data);
		
		if(data.recenttracks.track[0]) {
			var selected_data = data.recenttracks.track[0];
			var lfm_label	= 'Listening to:';
			$('.eq .graph').addClass('animated');
		} else {
			var selected_data = data.recenttracks.track;
			var lfm_label	= 'Recently played:';
		}
		
		var lfm_image 	= selected_data.image[image_id]['#text'];
		var lfm_artist 	= selected_data.artist['#text'];
		var lfm_album		= selected_data.album['#text'];
		var lfm_track		= selected_data.name;
		var lfm_image		= selected_data.image[image_id]['#text'];
 
 		$('<img></img>').attr('src', lfm_image).attr('class', 'cover').appendTo($('.playing'));
		$('<span class="track"><label>' + lfm_label + '</label> ' + lfm_track + '</span>').appendTo($('.playing .inner'));
		$('<span class="artist"><label>From:</label> ' + lfm_album + ' <label>by:</label> ' +  lfm_artist + '</span>').appendTo($('.playing .inner'));

	});
	//END - getRecentTracks JSON load
	
	String.prototype.cleanup = function() {
	   return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
	}
	
	function getImageScale(size) {
		var index = (size<=34) ? 0 : (size <= 64) ? 1 : (size <= 126) ? 2 : 3;
		return index;
	}
});
