const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if (req.path === '/doctors/login' || req.path === '/doctors/signup') return next();
        const token = req.headers['authorization'].split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT);
        req.dataUser = decodedToken;
        next()
    } catch (e) {
        res.status(401).json({
            error: 'Autenticación fallida'
        })
    }
};