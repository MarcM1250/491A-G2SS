const express = require('express');
const app = express();
const morgan = require('morgan'); // logs requests
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const uploadRoutes = require('./api/routes/uploadsRoutes');
const accountRoutes = require('./api/routes/accountsRoutes');
const downloadRoutes = require('./api/routes/downloadsRoutes');
var fs = require('fs');

// mongoose.connect('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/test?retryWrites=true',
//     {
//         useNewUrlParser: true,
//         useCreateIndex: true
//     });

// mongoose.connect('mongodb://localhost:27017/myapp',{ useNewUrlParser: true, useCreateIndex: true });
// mongoose.connection.once('open',function() {
//     console.log('Connection has been made');
// }).on('error', function(error) {
//     console.log('Connection error',error);
// });

// mongoose.connect('mongodb://localhost:27030/myapp', {useNewUrlParser: true});

// const conn = mongoose.createConnection('mongodb+srv://Minh:'+ process.env.MONGO_ATLAS_PW +'@g2ss-nomph.mongodb.net/test?retryWrites=true', 
//     { useNewUrlParser: true  }
//     )
//     // connect once
//     conn.once('open', function () {
//     mongoose.connect('mongodb+srv://Minh:'+ process.env.MONGO_ATLAS_PW +'@g2ss-nomph.mongodb.net/test?retryWrites=true', function(err, db) {
//   var bucket = new GridFSBucket(db, { bucketName: 'gridfsdownload' });
//         const bucket = new mongoose.mongo.GridFSBucket(db, {
//             bucketName: 'uploads'
//           });
//           bucket.openDownloadStream(mongoose.Types.ObjectId('5c97b5dce2fa8d0fd46ebbc7')).
//           pipe(fs.createWriteStream('1553393409237Capture.PNG')).
//           on('error', function(error) {
//             assert.ifError(error);
//           }).
//           on('finish', function() {
//             console.log('done!');
//             process.exit(0);
//           });
//         });
//     });

app.use(morgan('dev'));
//app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handling CORS errors (only for browsers (security in browsers))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); //prevent other webpage from using your api
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization "
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE');
        return res.status(200).json({});
    }
    next();
});


// Routes which should handle requests
app.use('/uploads', uploadRoutes);
app.use('/accounts', accountRoutes);
app.use('/downloads', downloadRoutes);

// error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// error handling
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
    console.log(error);
});

module.exports = app;