const jwt = require('jsonwebtoken');
const jsonwebtoken = process.env.JWT;
const withAuth = function(req, res, next) {
	try {
		const token =
			req.body.token ||
			req.query.token ||
			req.headers['x-access-token'] ||
			req.cookies.token;
		if (!token) {
			res.status(401).send('Unauthorized: No token provided');
		} else {
			jwt.verify(token, jsonwebtoken, function(err, decoded) {
				if (err) {
					res.status(401).send('Unauthorized: Invalid token');
				} else {
					req.username = decoded.username;
					req.idDoctor = decoded.id;
					next();
				}
			});
		}
	} catch {
		res.status(401).send('Unauthorized: No token provided');
	}
};
module.exports = withAuth;
