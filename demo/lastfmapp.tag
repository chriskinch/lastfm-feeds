
<lastfmapp>

	<h3>Last FM Riot Demo</h3>
	<div>A Simplistic Central Event Controller / Dispatcher For RiotJS, Inspired By Flux</div>
	<lastfm-recenttracks title='Demo'></lastfm-recenttracks>

	<script>
		var self = this
		self.items = []

		// Setting up JSOM config from provided params and settings.
		self.config = {
			url:'http://ws.audioscrobbler.com/2.0/?',
			params: {
				method:	self.opts.method,
				format:	'json',
				user: self.opts.user,
				api_key: self.opts.api_key,
				callback: ''
			}
		};

		Object.assign(self.config.params, self.opts.options)

	</script>


</lastfmapp>