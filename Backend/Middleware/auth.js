const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Grab token from cookie
    const token = req.cookies.token;

    // If no token, stop there
    if (!token) {
        return res.status(403).send('Please login first');
    }

    // Decode the token and get id
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret'); // Use environment variable for JWT secret
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).send('Invalid Token');
    }
};

module.exports = auth;
