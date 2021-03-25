const mongoose = require('mongoose');

const gadgetSchema = mongoose.Schema({
	name: { type: String, required: true },
    year: {type: Number, required: true},
    brand: {type: String, required: true},
	artifacts: { type: Number},
    seconds: { type: Number},
    studies: { type: Number}
});

module.exports = mongoose.model('Gadget', gadgetSchema);
