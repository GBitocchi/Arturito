const mongoose = require('mongoose');
const File = require('./File').schema;

const patientSchema = mongoose.Schema({
	name: { type: String, required: true },
	lastname: { type: String, required: true },
	identification: { type: String, required: true },
	birthdate: { type: Date, required: true },
	medicines: { type: String },
	pathologies: { type: String },
	medicalPlan: {
		medicalPlanCompany: { type: String, required: true },
		medicalPlanNumber: { type: String, required: true }
	},
	files: { type: [File], default: [] },
	logicaldel: Boolean,
	logicaldel_date: Date
});

module.exports = mongoose.model('Patient', patientSchema);
