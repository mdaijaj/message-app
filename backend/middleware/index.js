const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, 'aijajkhan');
        req.user = decoded.user_id;  
        console.log("req.user", req.user)
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
