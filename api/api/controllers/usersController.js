const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

exports.get_all = (req, res, next) => {
    User.find()
        //.select("") // data you want to fetch
        .exec()
        .then(docs => {
            res.status(200).json({
                users: docs
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.signup = (req, res, next) => {
    // Prevent duplicated account with same username
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user.length >= 1) {
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
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
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
    User.find({ username: req.body.username })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Authentication failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        username: user[0].username,
                        userId: user[0]._id
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

exports.delete = (req, res, next) => {
    User.remove({ username: req.params.username })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};