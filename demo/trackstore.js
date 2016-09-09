// LastfmStore definition.
// Flux stores house application logic and state that relate to a specific domain.
// In this case, a list of todo items.
function TrackStore() {
  riot.observable(this) // Riot provides our event emitter.
  
  var self = this;
      self.tracks = [];
      self.config = {};
      self.count = null;

  // Our store's event handlers / API.
  // This is where we would use AJAX calls to interface with the server.
  // Any number of views can emit actions/events without knowing the specifics of the back-end.
  // This store can easily be swapped for another, while the view components remain untouched.

  self.on('tracks_init', function(config) {
    self.config.url = config.url;
    self.config.params = config.params;
    self.count = config.params.limit;

    self.load(self.config.url, config.params);
  })

  self.on('tracks_add', function() {
    // Keep track of how many tracks are listed
    // Array.length is unreliable as some time will elaspe between add and load
    self.count++
    // Load just 1 extra album and now count per page
    self.config.params.limit = 1
    self.config.params.page = self.count;

    self.load(self.config.url, self.config.params);
  })

  self.on('tracks_remove', function() {
    self.count--
    self.tracks.pop()

    self.trigger('tracks_changed', self.tracks)
  })

  // The store emits change events to any listening views, so that they may react and redraw themselves.


  self.load = function(url, params) {
    // GET the JSON feed using XMLHttpRequest
    try {
      var xhr = new XMLHttpRequest();
      var prm = objToParams(params); // Convert our param object into a string
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var data = JSON.parse(xhr.response); // The response comes as a string so we convert it to JSON
          if(!data.error) {
            // if there is no error push to the track list
            each(data.recenttracks.track, function(index, track){
              self.tracks.push(track);
              self.playing(track);
            });
            console.log(self)
            self.trigger('tracks_changed', self.tracks);
          }else{
            console.log('Last.fm Feeds: ' + data.message);
          }
        }
      };
      xhr.open("GET", url + prm, true); // Async is true
      xhr.send(null);
    } catch (e) {
      console.log( 'Last.fm Feeds: Error loading JSON feed.' );
      console.log(e);
    } 
  }

  self.playing = function(track) {
    if(track['@attr']){
      track.hidden = true;
    }
  }

}
