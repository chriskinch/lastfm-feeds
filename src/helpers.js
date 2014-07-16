String.prototype.cleanup = function() {
	return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
};

Array.prototype.clean = function(del) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === del) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};