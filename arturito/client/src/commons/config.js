let url = 'http://localhost:8080/';
if (process.env.NODE_ENV === 'production') {
	url = 'https://app-arturito.herokuapp.com/';
}

export default {
	apiUrl: url
};
