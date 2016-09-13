import React from 'react';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';

import App from './js/App';
import './index.css';

import actions from './js/actions/actions';

import RecentTracksStore from'./js/stores/recentTracksStore';


var stores = {
	RecentTracksStore: new RecentTracksStore()
};

var flux = new Fluxxor.Flux(stores, actions);

flux.on('dispatch', function(type, payload) {
	console.log('[Dispatch]', type, payload);
});

window.flux = flux;

ReactDOM.render(
  <App flux={flux} />,
  document.getElementById('root')
);
