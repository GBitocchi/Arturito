const setToken = token => {
	localStorage.setItem('token', token);
};

const removeToken = () => {
	localStorage.removeItem('token');
};

const getToken = () => {
	return localStorage.getItem('token');
};

const getBearerAuth = () => {
	return {
		headers: {
			'Authorization': `Bearer ${getToken()}`
		}
	}
};

module.exports = { setToken, removeToken, getToken, getBearerAuth };
