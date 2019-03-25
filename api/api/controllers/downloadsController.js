const Download = require('../models/downloadModel');
const Upload = require('../models/uploadModel');
const mongoose = require('mongoose');

exports.get_all = (req, res, next) => {
    Download.find()
        //.select("file_name upload_by description _id file") // data you want to fetch
        .exec()
        .then(docs => {
            res.status(200).json({
                download: docs
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.create_download = (req, res, next) => {
    Upload.findById(req.params.uploadId)
        .exec()
        .then(result => {
            if (result) {
                if (result.delete_by !== undefined){
                    res.status(404).json({
                        message: "File already deleted"
                    });
                }else{
                const download = new Download({
                    _id: new mongoose.Types.ObjectId(),
                    upload_id: result._id,
                    download_by: req.userData.username,
                    download_date: Date.now()
                });
                download.save()
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                req.fileData = result;
                next();
                }
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
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

exports.get_download = (req, res, next) => {
    Download.find({ download_by: req.params.username })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    download: doc,
                });
            } else {
                res.status(404).json({ message: "No valid entry found for provided user" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};
