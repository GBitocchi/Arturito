import sweet from 'sweetalert2';

export default () =>
	sweet.fire({
		type: 'error',
		title: 'Oops!',
		text: 'Error con el servidor, por favor vuelvalo a intentar más tarde'
	});
