const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Account = require('../models/accountModel');

/**
 * RETURN ALL ACCOUNTS IN THE DATABASE 
 */
exports.get_all = (req, res, next) => {
    Account.find({}, { '_id': 0, '__v': 0, 'role': 0 }) // find accounts in the database using mongoose promise
        // .select("username password organization first_name last_name delete_permission")
        .exec()
        .then(docs => { // doc contains the accounts found, minus the _id field
            res.status(200).send(docs);
        })
        .catch(err => {
            err.status = 500;
            next(err);
            // res.status(500).json({
            //     error: err
            // });
        });
};

/**
 * GET A SINGLE ACCOUNT FROM THE DATABASE
 */
exports.get_account = (req, res, next) => {
    const username = req.params.username; // get username from request url
    Account.findOne({ username: username })
        // limit the fields returned
        .select("username password organization first_name last_name delete_permission")
        .exec()
        .then(result => {
            if (result) {
                res.status(200).send(result);
            } else {
                const error = new Error('No valid entry found for provided username');
                error.status = 409;
                console.log(error.message);

                return next(error);
                // res.status(200).json({
                //     message: "No valid entry found for provided username"
                // });
            }
        })
        .catch(err => {
            err.status = 500;
            next(err);
            // res.status(500).json({
            //     error: err
            // });
        });
};

/**
 * CREATE AN ACCOUNT
 */
exports.create_account = (req, res, next) => {
    if(!req.body.username || !req.body.password || !req.body.first_name || !req.body.last_name || req.body.delete_permission === undefined){
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
                // return res.status(409).json({
                //     message: 'Account exists'
                // });
            } else {
                // hash the password using bcrypt: second argument is the salt
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        err.status = 500;
                        next(err);
                        // return res.status(500).json({
                        //     error: err
                        // });
                    } else {
                        // create an account object with data parsed from the request body
                        const account = new Account({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash,
                            organization: req.body.organization,
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            delete_permission: req.body.delete_permission
                        });

                        // Save the new account to the database
                        account
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'Account created',
                                    account: account
                                });
                            })
                            .catch(err => {
                                err.status = 500;
                                next(err);
                                // res.status(500).json({
                                //     error: err
                                // });
                            });
                    }
                });
            }
        })
};

/**
 * GENERATE A JWT TOKEN FOR A USER IF USERNAME & PASSWORD MATCHED
 */
exports.login = (req, res, next) => {
    if(!req.body.username || !req.body.password){
        const error = new Error('Path `username` and `password` are required.');
        error.status = 400;
        return next(error);
    }
    // Check if the account exists based on the username passed
    Account.find({ username: req.body.username })
        .exec()
        .then(account => {
            // Return authentication failed if username does not exist in the DB
            if (account.length < 1) {
                const error = new Error('Username or password does not match');
                error.status = 401;
                return next(error);
                // return res.status(401).json({
                //     message: 'Authentication failed 01'
                // });
            }
            // Use the compare method from bcrypt to verify the account passwords
            bcrypt.compare(req.body.password, account[0].password, (err, result) => {
                if (err) {
                    err.status = 401;
                    console.log(err.message);
                    return next(err);
                    // return res.status(401).json({
                    //     message: 'Authentication failed 02'
                    // });
                }
                // if password matched, create a JWT Token for the user
                if (result) {
                    const token = jwt.sign({
                        username: account[0].username,
                        userId: account[0]._id,
                        delete_permission: account[0].delete_permission
                    }, process.env.JWT_KEY, // sign the token with a password (will be used to decode the token)
                        {
                            expiresIn: "10h"
                        });
                    // return the JWT Token
                    return res.status(200).json({
                        message: 'Authentication successful',
                        token: token,
                        delete_permission: account[0].delete_permission
                    });

                }
                const error = new Error('Username or password does not match');
                error.status = 401;
                next(error);
                // res.status(401).json({
                //     message: 'Authentication failed 03'
                // });
            });
        })
        .catch(err => {
            err.status = 500;
            next(err);
            // res.status(500).json({
            //     error: err
            // });
        });
};

/**
 * DELETE AN ACCOUNT FROM THE DATABASE
 */
exports.delete_account = (req, res, next) => {
    Account.remove({ username: req.params.username })
        .exec()
        .then(result => {
            if(result.deleteCount !== 0){
                const error = new Error('Account not found');
                error.status = 400;
                return next(error);
            }
            res.status(200).json({
                message: 'Account deleted'
            });
        })
        .catch(err => {
            err.status = 500;
            next(err);
            // res.status(500).json({
            //     error: err
            // });
        });
};
