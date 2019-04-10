const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Account = require('../models/accountModel');

exports.get_all = (req, res, next) => {
    Account.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                accounts: docs.map(doc => {
                    return {
                        username: doc.username,
                        password: doc.password
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

exports.get_account = (req, res, next) => {
    const username = req.params.username;
    Account.findOne({username: username})
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    account: {
                        username: result.username,
                        password: result.password
                    }
                });
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

exports.create_account = (req, res, next) => {
    // Prevent duplicated account with same username
    Account.find({ username: req.body.username })
        .exec()
        .then(account => {
            if (account.length >= 1) {
                return res.status(409).json({
                    message: 'Account exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const account = new Account({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash
                        });
                        account
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'Account created'
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

exports.login = (req, res, next) => {
    Account.find({ username: req.body.username })
        .exec()
        .then(account => {
            if (account.length < 1) {
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }
            bcrypt.compare(req.body.password, account[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Authentication failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        username: account[0].username,
                        userId: account[0]._id
                    }, process.env.JWT_KEY,
                        {
                            expiresIn: "10h"
                        });
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

