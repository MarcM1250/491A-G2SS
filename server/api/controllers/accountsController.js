const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Account = require('../models/accountModel');

/**
 * RETURN ALL ACCOUNTS IN THE DATABASE 
 */
exports.get_all = (req, res, next) => {
    Account.find() // find accounts in the database using mongoose promise
        .exec() 
        .then(docs => { // doc contains the accounts found
            res.status(200).json({
                accounts: docs.map(doc => { 
                    return {
                        username: doc.username,
                        password: doc.password,
                        organization: doc.organization,
                        first_name: doc.first_name,
                        last_name: doc.last_name,
                        delete_permission: doc.delete_permission
                    }
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

/**
 * GET A SINGLE ACCOUNT FROM THE DATABASE
 */
exports.get_account = (req, res, next) => {
    const username = req.params.username; // get username from request url
    Account.findOne({username: username})
        // limit the fields returned
        .select("username password organization first_name last_name delete_permission")
        .exec()
        .then(result => {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(200).json({
                    message: "No valid entry found for provided username"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

/**
 * CREATE AN ACCOUNT
 */
exports.create_account = (req, res, next) => {
    // Prevent duplicated account with same username
    Account.find({ username: req.body.username })
        .exec()
        .then(account => {
            if (account.length >= 1) { // return if username exists
                return res.status(409).json({
                    message: 'Account exists'
                });
            } else {
                // hash the password using bcrypt: second argument is the salt
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
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
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
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
    // Check if the account exists based on the username passed
    Account.find({ username: req.body.username })
        .exec()
        .then(account => {
            // Return authentication failed if username does not exist in the DB
            if (account.length < 1) {
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }
            // Use the compare method from bcrypt to verify the account passwords
            bcrypt.compare(req.body.password, account[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Authentication failed'
                    });
                }
                // if password matched, create a JWT Token for the user
                if (result) {
                    const token = jwt.sign({
                        username: account[0].username,
                        userId: account[0]._id
                    }, process.env.JWT_KEY, // sign the token with a password (will be used to decode the token)
                        {
                            expiresIn: "10h"
                        });
                    // return the JWT Token
                    return res.status(200).json({
                        message: 'Authentication successful',
                        token: token
                    });

                }
                res.status(401).json({
                    message: 'Authentication failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

/**
 * DELETE AN ACCOUNT FROM THE DATABASE
 */
exports.delete_account = (req, res, next) => {
    Account.remove({ username: req.params.username })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Account deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

