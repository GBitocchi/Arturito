const mongoose = require('mongoose');

const anomalySchema = mongoose.Schema({
    image: {type: String, required: true},
    value: {type: Number}
});

module.exports = mongoose.model('Anomaly', anomalySchema);