const Upload = require('../models/uploadModel');
const mongoose = require('mongoose');

exports.get_all = (req, res, next) => {
    Upload.find()
        .select("subject upload_by description _id files_id") // data you want to fetch
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
        upload_by: req.userData.username,
        subject: req.body.subject,
        description: req.body.description,
        files_id: req.file.id,
        //file: req.file.path,
        //file_size: req.file.size
    });
    upload
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created upload successfully',
                createdUpload: {
                    subject: result.subject,
                    upload_by: result.upload_by,
                    description: result.description,
                    _id: result._id,
                    files_id: result.files_id,
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
        .select('subject description _id file_id')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    upload: doc,
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

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
        .exec()
        .then(result => {
            if (result) {
                if (result.delete_by !== undefined)
                    res.status(404).json({
                        message: "File already deleted"
                    });
                result.updateOne({ $set: { delete_by: req.userData.username, delete_date: Date.now() } })
                    .exec()
                    .then(docs => {
                        req.fileData = result;
                        next();
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                });
            }
        }).catch(err => {
            res.status(500).json({
                message: err
            })
        })
};