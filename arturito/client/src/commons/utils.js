import moment from 'moment';

const anyEmpty = (state, avoidChecking) => {
	const keysToAvoid = ['__v', '_id', '__proto__'].concat(avoidChecking);
	return Object.keys(state).some(key => {
		if (typeof state[key] !== 'object') {
			return !keysToAvoid.includes(key) && (state[key] === '' || state[key] === null);
		} else {
			return Object.keys(state[key]).some(subKey => {
				return state[key][subKey] === '' || state[key][subKey] === null;
			});
		}
		// Extend to object types
	});
};

const allEmpty = state => {
	return Object.keys(state).every(key => {
		if (typeof state[key] !== 'object') {
			return state[key] === '' || state[key] === null;
		} else {
			return Object.keys(state[key]).every(subKey => {
				return state[key][subKey] === '' || state[key][subKey] === null;
			});
		}
	});
};

const getAge = date => {
	const birthdate = moment(date);
	const actualDate2 = moment(new Date());

	const diff = actualDate2.diff(birthdate, 'year');

	if (diff > 1) {
		return `${diff} años`;
	} else if (diff > 0) {
		return `${diff} año`;
	} else {
		return '';
	}
};

const validateNumber = value => {
	return !/^\d+$/.test(Number(value)) || value.includes('-') || value.includes(',');
};

const validatePlainText = value => {
	return !/^[A-Za-z\s]+$/.test(value);
};

const isEmptyField = value => {
	return value.length === 0;
};

export { anyEmpty, allEmpty, getAge, validateNumber, validatePlainText, isEmptyField };
