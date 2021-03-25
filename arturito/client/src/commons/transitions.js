import { useTransition } from 'react-spring';

export default patient =>
	useTransition(patient, patient => patient, {
		from: { opacity: 0.3 },
		enter: { opacity: 1 },
		leave: { opacity: 0.3 }
	});
