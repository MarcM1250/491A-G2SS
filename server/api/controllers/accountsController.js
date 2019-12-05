const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Account = require('../models/accountModel');

/**
 * RETURN ALL ACCOUNTS IN THE DATABASE 
 */
exports.get_all = (req, res, next) => {
    console.log(req.query.sort);
    // find all account in the database
    Account.find({}, { '_id': 0, '__v': 0, 'role': 0 }) // find accounts in the database using mongoose promise
        // .select("username password organization first_name last_name delete_permission")
        .limit(parseInt(req.query.count))
        .skip(parseInt(req.query.page-1)*parseInt(req.query.count))
        .sort(req.query.sort)
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
 * GET A SINGLE ACCOUNT FROM THE DATABASE
 */
exports.get_account = (req, res, next) => {
    const username = req.params.username; // get username from request url
    // find one account with a specific username in the database
    Account.findOne({ username: username })
        // limit the fields returned
        .select("username password organization first_name last_name delete_permission")
        .exec()
        .then(result => {
            if (result) { // found one account
                res.status(200).send(result);
            } else { // found no account
                const error = new Error('Account not found');
                error.status = 404;
                return next(error);
            }
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
    // validate request body for required fields: username, password, first_name, last_name, delete_permission
    if (!req.body.username || !req.body.password || !req.body.first_name || !req.body.last_name || req.body.delete_permission === undefined) {
        const error = new Error('Path `username`, `password`, `first_name`, `last_name`, and `delete_permission` are required.');
        error.status = 400;
        return next(error);
    }
    // prevent duplicated account with same username by searching the database for account with that username
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
                            delete_permission: req.body.delete_permission
                        });

                        // save the new account to the database
                        account
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'Account created',
                                    account: account
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

/**
 * GENERATE A JWT TOKEN FOR A USER IF USERNAME & PASSWORD MATCHED
 */
exports.login = (req, res, next) => {
    // validate request body for required fields: username, password
    if (!req.body.username || !req.body.password) {
        const error = new Error('Path `username` and `password` are required.');
        error.status = 400;
        return next(error);
    }
    // check if the account exists based on the username passed
    Account.find({ username: req.body.username })
        .exec()
        .then(account => {
            // return authentication failed if username does not exist in the DB
            if (account.length < 1) {
                const error = new Error('Username or password does not match');
                error.status = 401;
                return next(error);
            }
            // use the compare method from bcrypt to verify the account passwords
            bcrypt.compare(req.body.password, account[0].password, (err, result) => {
                if (err) {
                    err.status = 401;
                    console.log(err.message);
                    return next(err);
                }
                // if password matched, create a JWT Token for the user
                if (result) {
                    const token = jwt.sign({
                        username: account[0].username,
                        userId: account[0]._id,
                        delete_permission: account[0].delete_permission
                    }, process.env.JWT_KEY, // sign the token with a password (will be used to decode the token)
                        {
                            expiresIn: "8h"
                        });
                    // return the JWT Token
                    return res.status(200).json({
                        message: 'Authentication successful',
                        token: token,
                        role: account[0].role
                    });

                }
                const error = new Error('Username or password does not match');
                error.status = 401;
                next(error);
            });
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
    // remove an account with the specified username from the database
    Account.remove({ username: req.params.username })
        .exec()
        .then(result => {
            if (result.deletedCount === 0) { // deleted nothing
                const error = new Error('Account not found');
                error.status = 404;
                return next(error);
            }
            res.status(200).json({
                message: 'Account deleted'
            });
        })
        .catch(err => {
            err.status = 500;
            next(err);
        });
};
