const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from the header
    const token = req.header('Authorization');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // The token is usually sent in the format "Bearer <token>"
    // We need to extract the actual token part
    const tokenPart = token.split(' ')[1];
    
    if (!tokenPart) {
        return res.status(401).json({ message: 'Token format is invalid, authorization denied'});
    }

    // Verify token
    try {
        const decoded = jwt.verify(tokenPart, process.env.JWT_SECRET);
        
        // Attach the decoded admin payload to the request object
        req.admin = decoded.admin;
        next(); // Move to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};