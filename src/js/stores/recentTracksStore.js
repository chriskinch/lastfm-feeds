import Fluxxor from 'fluxxor';
import CONSTANTS from '../constants/constants';

import API from '../api/api';

var RecentTrackStore = Fluxxor.createStore({
    initialize: function(params) {
      this.state = {
        tracks:  []
      };

      this.bindActions(
        CONSTANTS.TRACKS.GET, this.getTracks
      );
    },

    getTracks: function() {
      API.tracksGet('method=user.getrecenttracks&user=chriskinch&api_key=de5f3c80c1116bc51987f9aebc9fc3e9&format=json', function(data) {
        this.state.tracks = data.recenttracks.track;
        this.emit('change:tracksGot');
        this.emit('change');
      }.bind(this));
    }
});

module.exports = RecentTrackStore;
