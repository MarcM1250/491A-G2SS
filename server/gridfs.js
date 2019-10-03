/**
 * This middleware uses multer to parse uploaded file and 
 * GridFSStorage to upload a file to the MongoDB.
 * Additionally there are functions to download and 
 * delete files in the DB using MongoGridFSBucket.
 * 
 */
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

/**
 * Local Database
 * Default connection: pools used to create and retrieve models 


/** 
 * Setting up storage using multer-gridfs-storage
 * GridFsStorage method takes in a db or url and a file cb 
 * Additional metadata can be added to the metadata field
 * BucketName changes fs.files to uploads.files default bucketName is "fs"
 */

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, './uploads/');
//     },
//     filename: function(req, file, cb) {
//       cb(null, Date.now() + file.originalname);
//     }
//   });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (path.extname(file.originalname) === '.kml') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

exports.start_upload = upload;

exports.download_file = (req, res, next) => {
    // create a new connection to handle each download request
    // const conn = mongoose.createConnection('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/G2SS_v1?retryWrites=true',
    //     { useNewUrlParser: true }
    // )
    
    // local connection
    const conn = mongoose.createConnection('mongodb://localhost:27017/myapp',{ useNewUrlParser: true, useCreateIndex: true });

    conn.once('open', function () {
        const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'uploads'
        });
        bucket.openDownloadStream(req.fileData._id)
            .pipe(res)
            .on('error', function (err) {
                conn.close();
                return res.status(500).json({
                    error: err
                });
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
    // const conn = mongoose.createConnection('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/G2SS_v1?retryWrites=true',
    //     { useNewUrlParser: true }
    // )
    
    // local connection
    const conn = mongoose.createConnection('mongodb://localhost:27017/myapp',{ useNewUrlParser: true, useCreateIndex: true });

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
