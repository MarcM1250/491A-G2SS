/**
 * This middleware uses jsonwebtoken to authenticate users
 * This method executes at the beginning of each request that requires user authentication.
 */
const jwt = require('jsonwebtoken');

exports.check_user = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // remove bearer
        // decode the token to get the user's data if the token if valid
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded; // saved userData to be used later
        next();
    } catch (err) {
        // return a different error message for missing token instead of split error
        if (!req.headers.authorization) {
            err.message = 'jwt missing';
        }
        err.status = 401;
        err.message = 'Authentication failed: ' + err.message;
        next(err);
    }
};

exports.check_admin = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // remove bearer
        // Decode the token to get the user's data if the token if valid
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (!decoded.role=== 'admin') {
            const error = new Error('Admin permission is required to access this route');
            error.status = 401;
            return next(error);
        }
        req.userData = decoded; // saved userData to be used later
        next();
    } catch (err) {
        if (!req.headers.authorization) { // return a different error message for missing token 
            err.message = 'jwt missing';
        }
        err.status = 401;
        err.message = 'Authentication failed: ' + err.message;
        next(err);
    }
};
