const Upload = require('../models/uploadModel');
const mongoose = require('mongoose');

exports.get_all = (req, res, next) => {
    Upload.find()
        .select("files_id subject description upload_date upload_by delete_date delete_by last_modified parser_errors") // data you want to fetch
        .exec()
        .then(docs => {
            res.status(200).json({
                uploads: docs
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.create_upload = (req, res, next) => {
    const upload = new Upload({
        _id: new mongoose.Types.ObjectId(),
        files_id: req.file.id,
        subject: req.body.subject,
        description: req.body.description,
        upload_date: Date.now(),
        upload_by: req.userData.username
        //file: req.file.path,
        //file_size: req.file.size
    });
    upload
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Created upload successfully',
                createdUpload: {
                    _id: result._id,
                    files_id: result.files_id,
                    subject: result.subject,
                    description: result.description,
                    upload_date: result.upload_date,
                    upload_by: result.upload_by,
                    //file: result.file,
                    //file_size: result.file_size,
                }
            });
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            })
        });
};

exports.get_upload = (req, res, next) => {
    Upload.findById(req.params.uploadId)
        .select("files_id subject description upload_date upload_by delete_date delete_by last_modified parser_errors") // data you want to fetch
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    upload: doc,
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided upload ID"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};
// need more work!
exports.patch_upload = (req, res, next) => {
    const id = req.params.uploadId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Upload.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Upload updated',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.delete_upload = (req, res, next) => {
    const id = req.params.uploadId;
    Upload.findById(id)
        .select("files_id subject description upload_date upload_by delete_date delete_by last_modified parser_errors") // data you want to fetch
        .exec()
        .then(result => {
            if (result) {
                if (result.delete_by !== undefined) {
                    res.status(404).json({
                        message: "File already deleted",
                        upload: result
                    });
                } else {
                    result.updateOne({ $set: { delete_by: req.userData.username, delete_date: Date.now() } })
                        .exec()
                        .then(doc => {
                            req.fileData = result;
                            next();
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided upload ID"
                });
            }
        }).catch(err => {
            res.status(500).json({
                message: err
            })
        })
};