/**
 * This middleware uses jsonwebtoken to authenticate users
 * This method executes at the beginning of request that 
 * requires user user authentication.
 */
const jwt = require('jsonwebtoken');

exports.check_user = (req, res, next) => {
    if(!req.headers.authorization){
        const error = new Error('jwt missing');
            error.status = 401;
            return next(error);
    }
    try {
        const token = req.headers.authorization.split(" ")[1]; // remove bearer
        // Decode the token to get the user's data if the token if valid
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded; // saved userData to be used later
        // console.log("User : \"", req.userData, "\""); 
        next();
    } catch (err) {
        err.status = 401;
        next(err);
        // return res.status(401).json({
        //     message: 'Authentication failed 04'
        // });
    }
};

exports.check_admin = (req, res, next) => {
    if(!req.headers.authorization){
        const error = new Error('jwt missing');
            error.status = 401;
            return next(error);
    }
    try {
        const token = req.headers.authorization.split(" ")[1]; // remove bearer
        // Decode the token to get the user's data if the token if valid
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if(!decoded.delete_permission){
            const error = new Error('Admin permission required to access this route');
            error.status = 401;
            return next(error);
        }
        req.userData = decoded; // saved userData to be used later
        // console.log("User : \"", req.userData, "\""); 
        next();
    } catch (err) {
         err.status = 401;
         next(err);
         // return res.status(401).json({
         //     message: 'Authentication failed 04'
         // });
    }
};
