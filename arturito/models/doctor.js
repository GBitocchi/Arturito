const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	lastname: { type: String, required: true },
	identification: { type: String, required: true },
	rol: {type: String, required: true},
	mail: {type: String, required: true}
});

module.exports = mongoose.model('Doctor', doctorSchema);
