const Download = require('../models/downloadModel');
const Upload = require('../models/uploadModel');
const mongoose = require('mongoose');

/**
 * RETURN ALL DOWNLOADS IN THE DATABASE
 */
exports.get_all = (req, res, next) => {
    Download.find()
        .select("_id upload_id upload_date download_by") // data you want to fetch
        .exec()
        .then(docs => {
            res.status(200).json({
                downloads: docs
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
 * DOWNLOAD A FILE AND CREATE AN DOWNLOAD
 */
exports.create_download = (req, res, next) => {
    // Find the file by upload_id
    Upload.findById(req.params.uploadId)
        .exec()
        .then(result => {
            if (result) {
                // Return if file has a delete_by field
                if (result.delete_by !== undefined) {
                    res.status(404).json({
                        message: "File already deleted"
                    });
                } else {
                    // Create a download object
                    const download = new Download({
                        _id: new mongoose.Types.ObjectId(),
                        upload_id: result._id,
                        download_by: req.userData.username,
                        download_date: Date.now(),
                        download_via: req.headers['user-agent']
                    });
                    // Save the download to the database
                    download.save()
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                    /**
                     * Save the upload_id and use Gridfs Middleware
                     * to return a file download to the user
                    */        
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

/**
 * GET ALL DOWNLOADS MADE BY A SINGLE USER
 */
exports.get_download = (req, res, next) => {
    Download.find({ download_by: req.params.username })
        .select("upload_id upload_date download_by") // data you want to fetch
        .exec()
        .then(results => {
            if (results) {
                res.status(200).json({
                    downloads: results,
                });
            } else {
                res.status(404).json({ message: "No valid entry found for provided account" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};
