import { validateNumber, validatePlainText, isEmptyField } from './utils';
import { errorPatient } from './errors';

const setFormatPatientErrors = patient => {
	let errors = errorPatient;
	errors = validatePlainText(patient.name) ? { ...errors, errorName: 'Formato de campo inválido' } : errors;
	errors = validatePlainText(patient.lastname) ? { ...errors, errorLastname: 'Formato de campo inválido' } : errors;
	errors = validateNumber(patient.identification)
		? { ...errors, errorIdentificacion: 'Formato de campo inválido' }
		: errors;
	errors = validatePlainText(patient.medicalPlan.medicalPlanCompany)
		? {
				...errors,
				errorMedicalPlan: { ...errors.errorMedicalPlan, errorMedicalPlanCompany: 'Formato de campo inválido' }
			}
		: errors;
	errors = validateNumber(patient.medicalPlan.medicalPlanNumber)
		? {
				...errors,
				errorMedicalPlan: { ...errors.errorMedicalPlan, errorMedicalPlanNumber: 'Formato de campo inválido' }
			}
		: errors;
	return errors;
};

const setEmptyPatientErrors = patient => {
	let errors = errorPatient;
	errors = isEmptyField(patient.name) ? { ...errors, errorName: 'Por favor complete el campo' } : errors;
	errors = isEmptyField(patient.lastname) ? { ...errors, errorLastname: 'Por favor complete el campo' } : errors;
	errors = isEmptyField(patient.identification)
		? { ...errors, errorIdentification: 'Por favor complete el campo' }
		: errors;
	errors = isEmptyField(patient.medicalPlan.medicalPlanCompany)
		? {
				...errors,
				errorMedicalPlan: { ...errors.errorMedicalPlan, errorMedicalPlanCompany: 'Por favor complete el campo' }
			}
		: errors;
	errors = isEmptyField(patient.medicalPlan.medicalPlanNumber)
		? {
				...errors,
				errorMedicalPlan: { ...errors.errorMedicalPlan, errorMedicalPlanNumber: 'Por favor complete el campo' }
			}
		: errors;
	return errors;
};

export { setEmptyPatientErrors, setFormatPatientErrors };
