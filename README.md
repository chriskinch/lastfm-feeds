# Last.FM Feeds

A little experiment into OAUTH2 and the Last.FM API. Use this script to pull a semantic, unstyled list from various Last.FM data feeds.

## Usage

- Requires jQuery 1.5 or above
- Include lastfm.feeds.js

````html
<script src="/path/to/jquery.js"></script>
<script src="/path/to/lastfm.feed.js"></script>
````

- In the `<head>` setup your default options

````javascript
var user = 'chriskinch';
var api_key = '[YOUR API KEY]'
var topalbum_options = {
  limit:'10',
  period:'1month',
}
var recenttracks_options = {
  limit:'5',
  playing: false,
}
````

- Initialise the feed

````javascript
lastfmfeeds.init('#lastfm_topalbums', user, api, 'user.gettopalbums', topalbum_options);
lastfmfeeds.init('#lastfm_recenttracks', user, api, 'user.getrecenttracks', recenttracks_options);
````

## Options

- `limit`: The number of results to fetch per page. Defaults to 10.
- `size`: The size of the cover art to return. Defaults to 64.
- `period`: Time frame to fetch data for. Defaults to '1month'. (overall | 7day | 1month | 3month | 6month | 12month)
- `cover`: Simple boolean toggle for the cover art.
- `album`: Simple boolean toggle for the album name.
- `artist`: Simple boolean toggle for the artist name.
- `plays`: Simple boolean toggle for the play count.
- `date`: Simple boolean toggle for the date.
- `playing`: Simple boolean toggle for now playing.

## Wrapping up...

More detailed documentation coming soon (TM)

## License

- MIT (http://www.opensource.org/licenses/mit-license.php)