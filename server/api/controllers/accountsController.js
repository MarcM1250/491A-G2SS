const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Account = require('../models/accountModel');
const USERS_BLOCKED_TIME = 60000;
/**
 * RETURN ALL ACCOUNTS IN THE DATABASE 
 */

exports.get_all = (req, res, next) => {
    Account.find({'role': 'user'}) // find accounts in the database using mongoose promise
        .select("_id username organization first_name last_name last_login_attempt")
        .exec()
        .then(docs => { // doc contains the accounts found, minus the _id field
            res.status(200).send(docs);
        })
        .catch(err => {
            err.status = 500;
            next(err);
        });
};


/**
 * CREATE AN ACCOUNT
 */
exports.create_account = (req, res, next) => {
    
    if(!req.body.username || !req.body.password || !req.body.first_name || !req.body.last_name ){
        const error = new Error('Path `username`, `password`, `first_name`, `last_name`, and `delete_permission` are required.');
        error.status = 400;
        return next(error);
    }
    // Prevent duplicated account with same username
    Account.find({ username: req.body.username })
        .exec()
        .then(account => {
            if (account.length >= 1) { // return if username exists
                const error = new Error('Account exists');
                error.status = 409;
                return next(error);

            } else {
                // hash the password using bcrypt: second argument is the salt
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        err.status = 500;
                        next(err);

                    } else {
                        // create an account object with data parsed from the request body
                        const account = new Account({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash,
                            organization: req.body.organization,
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                        });

                        // Save the new account to the database
                        account
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    code: '201',
                                    message: 'Account created',
                                });
                            })
                            .catch(err => {
                                err.status = 500;
                                next(err);

                            });
                    }
                });
            }
        })
};

exports.edit_account = (req, res, next) => {
    console.table(req.body)
    if(req.body.userid || req.body.password) {

        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                err.status = 500;
                next(err);

            } else {
                Account.updateOne( { _id: req.body.userid}, { first_name: req.body.first_name, last_name: req.body.last_name, organization: req.body.organization, password: hash }, (err, raw) => {
                    if (raw.ok) {
                        res.status(200).json({
                            code: '200',
                            message: 'User has been updated'
                        });
                    }
                });   
            }
        })
    } else {
    const error = new Error('Nice try');
    error.status = 403;
    next(error);
    }
};

exports.info_account = (req, res, next) => {
    if(req.params.userid) {
        Account.findOne( { _id: req.params.userid}, 'id first_name last_name organization username', (err, userInfo) => {
            if (!err) {
                res.status(200).send(userInfo);
                return;
            } 
            const error = new Error('No user found');
            error.status = 403;
            next(error);
        });   

    } else {
    const error = new Error('Nice try');
    error.status = 403;
    next(error);
    }
};

/**
 * GENERATE A JWT TOKEN FOR A USER IF USERNAME & PASSWORD MATCHED
 */

exports.unblockUser = (req, res, next) => {

    Account.find({ _id: req.params.userid })
        //.select()
        .exec()
        .then(account => {
            // Return authentication failed if username does not exist in the DB
            if (account.length < 1) {
                const error = new Error('Invalid credentials: Username \'' + userId + '\' is not registered');
                error.status = 401;
                return next(error);
            }

            Account.updateOne( { _id: account[0]._id}, { failed_login_attempts: 0 }, (err, raw) => {
                if (raw.ok) {
                    res.status(200).json({
                        code: '200',
                        message: 'User has been unblocked'
                    });
                }
            } );   
        })
        .catch(err => {
            err.status = 500;
            next(err);

        });
};

exports.login = (req, res, next) => {
    if(!req.body.username || !req.body.password){
        const error = new Error('Path `username` and `password` are required.');
        error.status = 400;
        return next(error);
    }
    // Check if the account exists based on the username passed
    Account.find({ username: req.body.username })
        //.select()
        .exec()
        .then(account => {
            // Return authentication failed if username does not exist in the DB
            if (account.length < 1) {
                const error = new Error('Invalid credentials: Username \'' + req.body.username + '\' is not registered');
                error.status = 401;
                return next(error);
            }

            let elapsed_time_since_last_attempt =  Date.now() - account[0].last_login_attempt;

            if (elapsed_time_since_last_attempt > USERS_BLOCKED_TIME ) {
                account[0].failed_login_attempts = 0;
                Account.updateOne( { _id: account[0]._id}, { failed_login_attempts: 0 }, (err, raw) => {
                    raw.ok? console.log("Success resetting counter:"):''
                } );
            }

            if (account[0].failed_login_attempts >= 3 && elapsed_time_since_last_attempt <= USERS_BLOCKED_TIME ) {
                
                const error = new Error('Your account has been blacklisted after 3 attempts');
                error.status = 403;
                error.timeleft = (USERS_BLOCKED_TIME - elapsed_time_since_last_attempt) / 1000;
                
                return next(error);
            }   

            bcrypt.compare(req.body.password, account[0].password, (err, result) => {

                // Update last login attempt date when attempts are equal to zero
                if (account[0].failed_login_attempts == 0 ) {
                    Account.updateOne( { _id: account[0]._id}, { last_login_attempt: Date.now() }, (err, raw) => {
                        if (raw.ok) console.log("Success updating last_login_attempt !")
                    } ); 
                }

                if (err) {
                    err.status = 500;
                    console.log(err.message);
                    return next(err);
                }

                // if password matched, create a JWT Token for the user
                if (result) {
                    
                    Account.updateOne( { _id: account[0]._id}, { failed_login_attempts: 0 }, _ => {});
            
                    const token = jwt.sign({
                        first_name: account[0].first_name,
                        userId: account[0]._id,
                        role: account[0].role
                    }, process.env.JWT_KEY, // sign the token with a password (will be used to decode the token)
                        {
                            expiresIn: "2h"
                        });
                    // return the JWT Token
                    return res.status(200).json({
                        message: 'Authentication successful',
                        token: token                    
                    });

                } 

                // pasword is wrong, update failed login attempts + 1
                Account.updateOne( { _id: account[0]._id}, { failed_login_attempts: account[0].failed_login_attempts + 1 }, (err, raw) => {
                    raw.ok? console.log("failed_login_attempts: ", account[0].failed_login_attempts + 1):''
                } ); 
                
                const error = new Error('Invalid credentials: wrong password');
                error.status = 401;
                next(error);
            });
            
            // Use the compare method from bcrypt to verify the account passwords

        })
        .catch(err => {
            err.status = 500;
            next(err);

        });
};

/**
 * DELETE AN ACCOUNT FROM THE DATABASE
 */
exports.delete_account = (req, res, next) => {
    Account.deleteOne({ _id: req.params.userid })
        .exec()
        .then(result => {
            if(!result.ok){
                const error = new Error('Account not found');
                error.status = 400;
                return next(error);
            }
            
            res.status(200).json({
                code: '200',
                message: 'Account deleted'
            });
        })
        .catch(err => {
            err.status = 500;
            next(err);
        });
};
