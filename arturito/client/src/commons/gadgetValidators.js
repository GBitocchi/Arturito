import { validateNumber, validatePlainText, isEmptyField } from './utils';
import { errorGadget } from './errors';

const setFormatGadgetErrors = gadget => {
	let errors = errorGadget;
	errors = validatePlainText(gadget.name) ? { ...errors, errorName: 'Formato de campo inválido' } : errors;
	errors = validateNumber(gadget.year) ? { ...errors, errorYear: 'Formato de campo inválido' } : errors;
	errors = validatePlainText(gadget.brand) ? { ...errors, errorBrand: 'Formato de campo inválido' } : errors;
	return errors;
};

const setEmptyGadgetErrors = gadget => {
	let errors = errorGadget;
	errors = isEmptyField(gadget.name) ? { ...errors, errorName: 'Por favor complete el campo' } : errors;
	errors = isEmptyField(gadget.year) ? { ...errors, errorYear: 'Por favor complete el campo' } : errors;
	errors = isEmptyField(gadget.brand) ? { ...errors, errorBrand: 'Por favor complete el campo' } : errors;
	return errors;
};

export { setEmptyGadgetErrors, setFormatGadgetErrors };
