let mongoose = require('mongoose');

let seasonSchema = mongoose.Schema({
	name:        { type:  String , required: true },
	description: { type:  String , required: true },
	tags:        { type: [String], required: true },
	episodes:    { type:  Number , required: true },
	cover:       { type:  String , required: true }
});

module.exports = mongoose.model('Season', seasonSchema);
