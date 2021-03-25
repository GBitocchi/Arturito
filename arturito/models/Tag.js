const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
	key: { type: String, required: true },
	value: { type: String, required: true }
});

module.exports = mongoose.model('Tag', tagSchema);
