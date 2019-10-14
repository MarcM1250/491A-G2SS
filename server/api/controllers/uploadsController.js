const Upload = require('../models/uploadModel');
const mongoose = require('mongoose');
const validator = require('./validator');
const { Readable } = require('stream');

/**
 * RETURN ALL UPLOADS IN THE DATABASE
 */
exports.get_all = (req, res, next) => {
    Upload.find()
        .select("_id title description upload_date upload_by delete_date last_modified delete_by filename file_size parser_status") // data you want to fetch
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
    // and parsed metadata using multer
    if(!req.file){
        return res.status(400).json({
            message: 'Path `file` is required.'
        })
    }

    // validate xml file using fast-xml-parser and store validation result in a json object
    const xmlString = req.file.buffer.toString('utf8');

    validator.validateXML( xmlString, function (err, validationResults) {

        console.log("My RESULTS: ", validationResults)

        // this id will be used for the upload_id and fs.files_id
        const files_id = new mongoose.Types.ObjectId();

        const upload = new Upload({
            _id: files_id,
            title: req.body.title,
            description: req.body.description,
            upload_date: Date.now(),
            last_modified: Date.now(),
            upload_by: req.userData.username,
            filename: req.file.originalname,
            file_size: req.file.size,
            parser_status: validationResults
        });
        // save the upload to the database
        upload
            .save()
            .then(result => {
                // uploading file to database
                const readableStream = new Readable();
                readableStream.push(req.file.buffer);
                readableStream.push(null);

                    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                        bucketName: 'uploads'
                    });
                    readableStream.
                        pipe(bucket.openUploadStreamWithId(files_id, req.file.originalname)).
                        on('error', function (error) {
                            return res.status(500).json({
                                error: error
                            });
                        }).
                        on('finish', function (file) {
                            console.log('Upload successful');
                        });
                res.status(201).json({
                    message: '"Upload created successfully"',
                    createdUpload: {
                        _id: result._id,
                        title: result.title,
                        description: result.description,
                        upload_date: result.upload_date,
                        upload_by: result.upload_by,
                        last_modified: result.last_modified,
                        filename: result.filename,
                        file_size: result.file_size,
                        parser_status: result.parser_status
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });
    });
};

/**
 * GET A SINGLE UPLOAD FROM THE DATABASE
*/
exports.get_upload = (req, res, next) => {
    Upload.findById(req.params.uploadId)
    .select("_id title description upload_date upload_by delete_date delete_by filename file_size parser_status") // data you want to fetch
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
 * DELETE AN UPLOAD FROM THE DATABASE
 * THIS METHOD REMOVE THE FILES DATA FROM THE DATABASE
 * AND UPDATE THE "DELETE_BY" AND "DELETE_DATE" OF THE UPLOAD
 */
exports.delete_upload = (req, res, next) => {

    // find the upload by upload_id
    Upload.findById(req.params.uploadId)
        .select("_id") // data you want to fetch
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
                        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                            bucketName: 'uploads'
                        });
                        bucket.delete(result._id, function (error) {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({
                                    error: error
                                });
                            }else{
                            res.status(200).json({
                                message: 'Delete successful',
                            });
                        }
                        });
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