# Last.FM Feeds

A little experiment into OAUTH2 and the Last.FM API. Use this script to pull a semantic, unstyled list from various Last.FM data feeds.

## Features

* __Standalone:__ Does not require jQuery, wooohooo!
* __Lightweight:__ I do the best I can to keep bloat down but I am alway on the lookout for leaner code.
* __AMD Compatible:__ Load Last.FM feeds via require.js, an async loader of your choice or reetro style.

## Usage

* Just include the lastfmfeeds.min.js script in the `<head>` somewhere and you are ready to go.

````html
<script src="/path/to/lastfmfeeds.min.js"></script>
````

* Initialise the feed like this:

````javascript
lastfmfeeds.init(
	'#lastfm_recenttracks',
	'chriskinch',
	'de5fdc80c3336bc51967f9aabc9fc3e0',
	'user.getrecenttracks
');
````
* Required parameters include:
	* `selector` {String}: ID or class of the feed container element. 
	* `user` {String}: Your last.fm username.
	* `api_key` {String}: Your last.fm api key.
	* `method` {String}: The type of feed to fetch. (user.gettopalbums | user.getrecenttracks)

## Options

* Options can be added to the init call as a key:value formatted Object.

````javascript
lastfmfeeds.init(
	'#lastfm_topalbums',
	'chriskinch',
	'de5fdc80c3336bc51967f9aabc9fc3e0',
	'user.gettopalbums', {
		limit: 100,
		period: '12month',
		cover: false
});
````

* Available options include:
	* `limit` {Number}: The number of results to fetch per page. (Defaults to 10)
	* `size` {Number}: The size of the cover art to return. (Defaults to 64)
	* `period` {String}: Time frame to fetch data for. (Defaults to '1month' - overall | 7day | 1month | 3month | 6month | 12month)
	* `cover` {Boolean}: Simple boolean toggle for the cover art.
	* `album` {Boolean}: Simple boolean toggle for the album name.
	* `artist` {Boolean}: Simple boolean toggle for the artist name.
	* `plays` {Boolean}: Simple boolean toggle for the play count.
	* `date` {Boolean}: Simple boolean toggle for the date.
	* `playing` {Boolean}: Simple boolean toggle for now playing.

## To do...

* Add more feeds such as top artists and recent loved tracks.
* Look into a way to add flexible markup without adding to much extra weight.
* Installation via Bower.
* Suggestions welcomed!

## License

- MIT (http://www.opensource.org/licenses/mit-license.php)