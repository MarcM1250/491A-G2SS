const Upload = require('../models/uploadModel');
const mongoose = require('mongoose');

/**
 * RETURN ALL UPLOADS IN THE DATABASE
 */
exports.get_all = (req, res, next) => {
    Upload.find()
        .select("files_id title description upload_date upload_by delete_date delete_by last_modified filename file_size parser_errors") // data you want to fetch
        .exec()
        .then(docs => {
            res.status(200).send(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

/**
 * CREATE AN UPLOAD AND STORE THE UPLOADED FILE DATA TO THE DATABASE
 */
exports.create_upload = (req, res, next) => {
    // create an upload object using the data parsed from the request body
    // and parsed metadata from the gridfs middleware
    if(!req.file){
        return res.status(400).json({
            message: 'Path `file` is required.'
        })
    }
    const upload = new Upload({
        _id: new mongoose.Types.ObjectId(),
        files_id: req.file.id,
        title: req.body.title,
        description: req.body.description,
        upload_date: Date.now(),
        upload_by: req.userData.username,
        filename: req.file.filename,
        file_size: req.file.file_size
    });
    // save the upload to the database
    upload
        .save()
        .then(result => {
            res.status(201).json({
                message: '"Upload created successfully"',
                createdUpload: {
                    _id: result._id,
                    files_id: result.files_id,
                    title: result.title,
                    description: result.description,
                    upload_date: result.upload_date,
                    upload_by: result.upload_by,
                    filename: result.filename,
                    file_size: result.file_size,
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
            req.fileData = upload;
            next();
        });
};

/**
 * GET A SINGLE UPLOAD FROM THE DATABASE
 */
exports.get_upload = (req, res, next) => {
    Upload.findById(req.params.uploadId)
    .select("files_id title description upload_date upload_by delete_date delete_by last_modified parser_errors") // data you want to fetch
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
/**
 * NEED MORE WORK!
 * 
 */
exports.patch_upload = (req, res, next) => {
    const id = req.params.uploadId;
    // Upload should be patched even if some fields are missing
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

/**
 * DELETE AN UPLOAD FROM THE DATABASE
 * THIS METHOD REMOVE THE FILES DATA FROM THE DATABASE
 * AND UPDATE THE "DELETE_BY" AND "DELETE_DATE" OF THE UPLOAD
 */
exports.delete_upload = (req, res, next) => {
    const id = req.params.uploadId;
    // find the upload by upload_id
    Upload.findById(id)
        .select("files_id title description upload_date upload_by delete_date delete_by last_modified parser_errors") // data you want to fetch
        .exec()
        .then(result => {
            if (result) {
                // return if file has is already deleted
                if (result.delete_by !== undefined){
                    res.status(404).json({
                        message: "File already deleted",
                        upload: result
                    });
                }else{
                // update the "delete_by" and "delete_date" fields 
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