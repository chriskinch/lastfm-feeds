import React from 'react';
import Fluxxor from'fluxxor';

var FluxMixin         = Fluxxor.FluxMixin(React);
var StoreWatchMixin   = Fluxxor.StoreWatchMixin;

import Track from './track'

module.exports = React.createClass({
  displayName: 'Tracks',
  mixins: [FluxMixin, StoreWatchMixin('RecentTracksStore')],

  getStateFromFlux: function() {
    var flux = this.getFlux();

    return {
        tracks: flux.store('RecentTracksStore').state.tracks
    };
  },

  render: function() {
    var tracks = [];



    if (this.state.tracks) {
      this.state.tracks.forEach(function(track) {
        track.key = (track.date) ? String(track.date.uts) : "playing";
        tracks.push(
          <Track key={track.key} track={track} />
        );
      });
    }

    return (
      <ul className="tracks">
        {tracks}
      </ul>
    );
  }

});
