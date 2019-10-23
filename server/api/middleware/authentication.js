/**
 * This middleware uses jsonwebtoken to authenticate users
 * This method executes at the beginning of request that 
 * requires user user authentication.
 */
const jwt = require('jsonwebtoken');

exports.check_user = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // remove bearer
        // Decode the token to get the user's data if the token if valid
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded; // saved userData to be used later
        // console.log("User : \"", req.userData, "\""); 
        next();
    } catch (err) {
        if(!req.headers.authorization){
            err.message = 'jwt missing';
        }
        err.status = 401;
        err.message = 'Authentication failed: ' + err.message;
        next(err);
        // return res.status(401).json({
        //     message: 'Authentication failed 04'
        // });
    }
};

exports.check_admin = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // remove bearer
        // Decode the token to get the user's data if the token if valid
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if(!decoded.delete_permission){
            const error = new Error('Admin permission is required to access this route');
            error.status = 401;
            return next(error);
        }
        req.userData = decoded; // saved userData to be used later
        // console.log("User : \"", req.userData, "\""); 
        next();
    } catch (err) {
        if(!req.headers.authorization){
            err.message = 'jwt missing';
        }
        err.status = 401;
        err.message = 'Authentication failed: ' + err.message;
        next(err);
         // return res.status(401).json({
         //     message: 'Authentication failed 04'
         // });
    }
};
