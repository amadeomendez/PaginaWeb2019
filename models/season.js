let mongoose = require('mongoose');

let seasonSchema = mongoose.Schema({
	name:        { type:  String , required: true },
	description: { type:  String , required: true },
	tags:        { type: [String], required: true },
	episodes:    { type: [String], required: true },
	cover:       { type:  String , required: true }
});

module.exports = mongoose.model('Season', seasonSchema);
