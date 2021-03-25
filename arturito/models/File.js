const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
	name: {	type: String, required: true},
	date: { type: Date, required: true },
	originalPath: { type: String, required: true },
	modificationDate: { type: Date, required: true },
	resultPath: { type: String },
	doctor: {
		name: { type: String },
		id: { type: String}
	},
	diagnosis: { type: String },
	artifacts: { type: Number },
	seconds: { type: Number },
	stage: { type: String },
	status: {
		seconds: Number,
		total: Number
	},
	logicaldel: Boolean,
	logicaldel_date: Date,
	metrics: { any: Object},
	acc: {type: Number},
	gadget: {type: String},
	tags: {type: [String]}
});

module.exports = mongoose.model('File', fileSchema);
