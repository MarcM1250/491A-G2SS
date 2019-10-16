const Download = require('../models/downloadModel');
const Upload = require('../models/uploadModel');
const mongoose = require('mongoose');

/**
 * RETURN ALL DOWNLOADS IN THE DATABASE
 */
exports.get_all = (req, res, next) => {
    Download.find()
        .select("_id upload_id upload_date download_by download_via") // data you want to fetch
        .exec()
        .then(docs => {
            res.status(200).json({
                downloads: docs
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
 * DOWNLOAD A FILE AND CREATE AN DOWNLOAD
 */
exports.create_download = (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.uploadId)){
        const error = new Error('Parameter must be a valid ObjectId');
        error.status = 400;
        return next(error);
    }
    // Find the file by upload_id
    Upload.findById(req.params.uploadId)
        .exec()
        .then(result => {
            if (result) {
                // Return if file has a delete_by field
                if (result.delete_by !== undefined) {
                    const error = new Error('File already deleted');
                    error.status = 404;
                    return next(error);
                    // res.status(404).json({
                    //     message: "File already deleted"
                    // });
                } else {
                    // Create a download object
                    const download = new Download({
                        _id: new mongoose.Types.ObjectId(),
                        upload_id: result._id,
                        download_by: req.userData.username,
                        download_date: Date.now(),
                        download_via: req.body.download_via || 'API'
                    });
                    // set response header filename or else it would return response.minetype
                    res.setHeader("Content-Disposition", "attachment; filename=" + result.filename);
                    // Save the download to the database
                    download.save()
                    .then(result => {
                        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                            bucketName: 'uploads'
                        });
                        bucket.openDownloadStream(result.upload_id)
                            .pipe(res)
                            .on('error', function (error) {
                                error.status = 500;
                                return next(error);
                                // return res.status(500).json({
                                //     error: error
                                // });
                            })
                            .on('finish', function () {
                                // console.log('Download successful');
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
            } else {
                const error = new Error('No valid entry found for provided ID');
                error.status = 404;
                next(error);
                // res.status(404).json({
                //     message: "No valid entry found for provided ID"
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
 * GET ALL DOWNLOADS MADE BY A SINGLE USER
 */
exports.get_download = (req, res, next) => {
    Download.find({ download_by: req.params.username })
        .select("upload_id upload_date download_by download_via") // data you want to fetch
        .exec()
        .then(results => {
            if (results.length >= 1) {
                res.status(200).json({
                    downloads: results
                });
            } else {
                const error = new Error("No valid entry found for provided account");
                error.status = 404;
                next(error);
                // res.status(404).json({ message: "No valid entry found for provided account" });
            }
        })
        .catch(err => {
            err.status = 500;
            next(err);
            // res.status(500).json({ error: err });
        });
};
