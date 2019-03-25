const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');
var fs = require('fs');

// const connection = mongoose.createConnection('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/test?retryWrites=true',
//     { useNewUrlParser: true }
// )

mongoose.connect('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/test?retryWrites=true',{ useNewUrlParser: true, useCreateIndex: true });

// mongoose.connect('mongodb://localhost:27017/myapp',{ useNewUrlParser: true, useCreateIndex: true });
// const conn = mongoose.connection;
// conn.once('open',function() {
//     console.log('Connection has been made');
//     // const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
//     //     bucketName: 'uploads'
//     // });
//     //     bucket.openDownloadStream(mongoose.Types.ObjectId('5c991e90b8ef7c2334d4a28b')).
//     //       pipe(fs.createWriteStream('1553393409237Capture.PNG')).
//     //       on('error', function(error) {
//     //         assert.ifError(error);
//     //       }).
//     //       on('finish', function() {
//     //         console.log('done!');
//     //         process.exit(0);
//     //       });
// }).on('error', function(error) {
//     console.log('Connection error',error);
// });

// Upload locally
/*
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/'); //call back
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
*/

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
            })
            .on('finish', function () {
                console.log('Download successful!');
            });
    }).on('error', function(error) {
        console.log('Connection error',error);
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
            if (error)
                res.status(500).json({
                    error: error
                });
            res.status(200).json({
                message: 'Delete successfully'
            });
        });
    });
};