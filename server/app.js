const express = require('express');
const app = express();
const morgan = require('morgan'); // logs requests
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const uploadRoutes = require('./api/routes/uploadsRoutes');
const accountRoutes = require('./api/routes/accountsRoutes');
const downloadRoutes = require('./api/routes/downloadsRoutes');

// mongoose.connect('mongodb://localhost:27017/myapp',{ useNewUrlParser: true, useCreateIndex: true });
mongoose.connect('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/G2SS_v1?retryWrites=true',{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

mongoose.connection.once('open',function() {
    console.log('Connection to DB has been made');
}).on('error', function(error) {
    console.log('DB Connection error',error);
});

// Morgan middleware used to log requests
app.use(morgan('dev'));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handling CORS errors (only for browsers (security in browsers))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); //prevent other webpage from using your api
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    // Browsers seem to always send an OPTION request on load
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/api/uploads', uploadRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/downloads', downloadRoutes);

// error handling for requests to unsupported routes
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// error handling for others errors
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