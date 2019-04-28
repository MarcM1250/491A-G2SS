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
 * Default connection: pools used to create and retrieve models 
*/
mongoose.connect('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/test?retryWrites=true',{ useNewUrlParser: true, useCreateIndex: true });

mongoose.connection.once('open',function() {
    console.log('Connection to DB has been made');
}).on('error', function(error) {
    console.log('DB Connection error',error);
});

/** Setting up storage using multer-gridfs-storage */
const storage = GridFsStorage({
    db: mongoose.connection,
    file: (req, file) => {
        return {
            filename: Date.now() + file.originalname,
            bucketName: 'uploads',
            metadata: {
                originalname: file.originalname,
            }
        };
    },
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error("Invalid file format"), false);
    }
}
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
    const conn = mongoose.createConnection('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/test?retryWrites=true',
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
    const conn = mongoose.createConnection('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/test?retryWrites=true',
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
                res.status(500).json({
                    error: error
                });
            }else{
            res.status(200).json({
                message: 'Delete successful',
                //upload: req.fileData
            });
        }
        conn.close();
        });
    }).on('error', function(error) {
        console.log('Connection error',error);
        conn.close();
    });
}