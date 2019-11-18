const express = require('express');
const app = express();
const morgan = require('morgan'); // logs requests
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const uploadRoutes = require('./api/routes/uploadsRoutes');
const accountRoutes = require('./api/routes/accountsRoutes');
const downloadRoutes = require('./api/routes/downloadsRoutes');
const logger = require('./api/utils/logger');

// mongoose.connect('mongodb://localhost:27017/myapp',{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/G2SS_v1?retryWrites=true',{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, function(err) {
    if (err) {
        logger.error(`[${new Date().toUTCString()}] - DB Connection Error - ${err.message}`);
        process.exit(1);
    }else{
        logger.info(`[${new Date().toUTCString()}] - Connection to DB has been made`);
    }
});

// morgan middleware used to log requests
app.use(morgan(':status :remote-addr :remote-user [:date[web]] ":method :url HTTP/:http-version" :user-agent :res[content-length]', { skip: (req, res) => { return res.statusCode >= 400 }, stream: logger.stream }));

// body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handling CORS errors (only for browsers (security in browsers))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); //prevent other webpage from using your api
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    // browsers seem to always send an OPTION request on load
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

// routes which should handle requests
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
    if(error.code === 'LIMIT_FILE_SIZE'){ // change default multer error status code for file_size limit: (500)
        error.status = 400;
    }
    logger.error(`${error.status || 500} ${req.ip} - [${new Date().toUTCString()}] - ${error.message} - "${req.method} ${req.originalUrl} HTTP/${req.httpVersion}" ${req.headers['user-agent']}`);
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;