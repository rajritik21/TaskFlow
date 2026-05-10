const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            console.error('No Authorization header present');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
        
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.replace('Bearer ', '') 
            : authHeader;
            
        console.log('Processing token:', token.substring(0, 15) + '...');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully, user ID:', decoded.id);
        
        // Use id instead of _id to match token payload
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(401).json({ message: 'Please authenticate' });
    }
};

module.exports = auth;