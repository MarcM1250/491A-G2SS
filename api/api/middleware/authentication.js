const jwt = require('jsonwebtoken');

exports.check_user = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // remove bearer
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        console.log(req.userData);
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication failed'
        });
    }

};