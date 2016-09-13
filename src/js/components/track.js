import React from 'react';

module.exports = React.createClass({
  displayName: 'Track',
  render: function() {
    var track = this.props.track;
        track.cover = this.props.track.image[1]['#text'];
        track.tooltip = track.artist['#text'] + " - " + track.name + " - " + track.album['#text'];
        track.played = (track.date) ? ", played " + track.date['#text'] : null;
        track.alt = track.album['#text'] + " cover";

    var styles = {
      opacity: 1
    };

    return (
      <li title={track.tooltip + track.played} style={styles}>
        <a href={track.url} target="_blank">
          <img src={track.cover} className="cover" width="50" height="50" alt={track.alt} />
          <span className="info">
            <div className="artist">{track.artist['#text']}</div>
            <div className="album">{track.name}</div>
            <div className="track">{track.album['#text']}</div>
          </span>
        </a>
      </li>
    );
  }

});
