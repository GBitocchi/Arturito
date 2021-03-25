const errorPatient = {
	errorName: '',
	errorLastname: '',
	errorIdentification: '',
	errorBirthdate: '',
	errorMedicalPlan: {
		errorMedicalPlanCompany: '',
		errorMedicalPlanNumber: ''
	},
	errorMedicines: '',
	errorPathologies: ''
};

const errorDoctor = {
	errorUsername: '',
	errorPassword: '',
	errorName: '',
	errorLastname: '',
	errorIdentification: '',
	errorRol: '',
	errorMail: ''
};

const errorGadget = {
	errorName: '',
	errorYear: '',
	errorBrand: ''
};

export { errorPatient, errorDoctor, errorGadget };
