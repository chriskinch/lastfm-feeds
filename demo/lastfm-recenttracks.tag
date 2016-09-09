
<lastfm-recenttracks>

	<button onclick={ add }>More</button>
	<button disabled={ !items.length } onclick={ remove }>Less</button>

	<h3>{ opts.title }</h3>

	<ol>
		<li each={ items.filter( hidden ) } class={ playing: this['@attr'].nowplaying }>
			<a href={ url } target="_blank">
				<img src={ image[this.getImageKey(64)]['#text'] } class="cover" width="64" height="64" />
				<div class="info">
					<div class="artist">{ artist['#text'] }</div>
					<div class="album">{ album['#text'] }</div>
					<div class="track">{ name }</div>
					<div class="plays">{ playcount }</div>
				</div>
			</a>
		</li>
	</ol>

  <script>
	var self = this
	self.items = []

	var parent = self.parent;
	
	self.on('mount', function() {
	  // Trigger init event when component is mounted to page.
	  // Any store could respond to this.
	  RiotControl.trigger('tracks_init', parent.config)
	})

	// Register a listener for store change events.
	RiotControl.on('tracks_changed', function(tracks) {
	  self.items = tracks
	  self.update()
	})

	add(e) {
		// Pass the amoutn of items to add
		RiotControl.trigger('tracks_add')
	}

	remove(e) {
		RiotControl.trigger('tracks_remove')
	}

	hidden(track) {
		return !track.hidden
	}

	getImageKey(size) {
	  var index = (size<=34) ? 0 : (size <= 64) ? 1 : (size <= 126) ? 2 : 3;
	  return index;
	}

  </script>

</lastfm-recenttracks>