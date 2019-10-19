let mongoose = require('mongoose');

let episodeListSchema = mongoose.Schema({
	episodes: { type: Array<String>, required: true }
});

module.exports = mongoose.model('EpisodeList', episodeListSchema);
