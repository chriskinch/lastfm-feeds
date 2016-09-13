import CONSTANTS from '../constants/constants';

var actions = {
	tracks: {
		get: function() {
			this.dispatch(CONSTANTS.TRACKS.GET, {});
		},
		got: function() {
			this.dispatch(CONSTANTS.TRACKS.GOT, {});
		}
	}
};

module.exports = actions;