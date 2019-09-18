/**
 * This middleware uses multer to parse uploaded file and 
 * GridFSStorage to upload a file to the MongoDB.
 * Additionally there are functions to download and 
 * delete files in the DB using MongoGridFSBucket.
 * 
 */
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');

/**
 * Local Database
 * Default connection: pools used to create and retrieve models 
 */
//const conn = mongoose.connect('mongodb://localhost:27017/myapp',{ useNewUrlParser: true, useCreateIndex: true });

/** 
 * Default connection: pools used to create and retrieve models 
 */
mongoose.connect('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/G2SS_v1?retryWrites=true',{ useNewUrlParser: true, useCreateIndex: true });

mongoose.connection.once('open',function() {
    console.log('Connection to DB has been made');
}).on('error', function(error) {
    console.log('DB Connection error',error);
});

/** 
 * Setting up storage using multer-gridfs-storage
 * GridFsStorage method takes in a db or url and a file cb 
 * Additional metadata can be added to the metadata field
 * BucketName changes fs.files to uploads.files default bucketName is "fs"
 */
const storage = GridFsStorage({
    db: mongoose.connection,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads', // default = 'fs'
            metadata: {
                originalname: file.originalname,
            }
        };
    },
});

/**
 * File can be filtered here!
 * @param {*} req 
 * @param {*} file 
 * @param {*} cb 
 */
const fileFilter = (req, file, cb) => {
    // 
    console.log("=> File.mimetype : " + file.mimetype + "\n");

    //reject a file, only accepts KML
    // ********************************************************************
    // TODO cb => isFileValid(): boolean
    // ********************************************************************
    if (file.mimetype === 'application/octet-stream') {
    //if (file.mimetype === 'application/octet-stream') {
        cb(null, true);
    } else {
        cb(new Error("Invalid file format"), false);
    }
}

/**
 * Create an upload with the storage 
 */
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //5mb limit
    },
    fileFilter: fileFilter
});

exports.start_upload = upload;

exports.download_file = (req, res, next) => {
    // create a new connection to handle each download request
    const conn = mongoose.createConnection('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/G2SS_v1?retryWrites=true',
        { useNewUrlParser: true }
    )
    
    // local connection
    // const conn = mongoose.createConnection('mongodb://localhost:27017/myapp',{ useNewUrlParser: true, useCreateIndex: true });

    conn.once('open', function () {
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'uploads'
        });
        bucket.openDownloadStream(req.fileData.files_id)
            .pipe(res)
            .on('error', function (err) {
                res.status(500).json({
                    error: err
                });
                conn.close();
            })
            .on('finish', function () {
                console.log('Download successful');
                conn.close();
            });
    }).on('error', function(error) {
        console.log('Connection error',error);
        conn.close();
    });
}

exports.delete_file = (req, res, next) => {
    // create a new connection to handle each delete request
    const conn = mongoose.createConnection('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/G2SS_v1?retryWrites=true',
        { useNewUrlParser: true }
    )
    
    // local connection
    // const conn = mongoose.createConnection('mongodb://localhost:27017/myapp',{ useNewUrlParser: true, useCreateIndex: true });

    conn.once('open', function () {
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'uploads'
        });
        bucket.delete(req.fileData.files_id, function (error) {
            if (error) {
                console.log(error);
                if(!res.headersSent) {
                res.status(500).json({
                    error: error
                });
            }
            }else{
                console.log(res.headersSent);
                if(!res.headersSent) {
            res.status(200).json({
                message: 'Delete successful',
                //upload: req.fileData
            });
        }
        }
        conn.close();
        });
    }).on('error', function(error) {
        console.log('Connection error',error);
        conn.close();
    });
}
