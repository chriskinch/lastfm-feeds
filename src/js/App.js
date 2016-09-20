import React from 'react';
import Fluxxor from'fluxxor';

var FluxMixin = Fluxxor.FluxMixin(React);

import '../css/App.css';
import logo from '../images/logo.svg';
import Tracks from './components/tracks';

module.exports = React.createClass({
  displayName: 'App',
  mixins: [FluxMixin],

  componentWillMount:function() {
    // Mount the app
    this.getFlux().actions.tracks.get();
  },

  render: function() {
    return (
      <div className="app">
        <img src={logo} />
        <Tracks />
      </div>
    );
  }

});
