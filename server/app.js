const express = require('express');
const app = express();
const morgan = require('morgan'); // logs requests
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const uploadRoutes = require('./api/routes/uploadsRoutes');
const accountRoutes = require('./api/routes/accountsRoutes');
const downloadRoutes = require('./api/routes/downloadsRoutes');
const logger = require('./api/utils/logger');

// mongoose.connect('mongodb://localhost:27017/myapp',{ useNewUrlParser: true, useCreateIndex: true });
mongoose.connect('mongodb+srv://Minh:' + process.env.MONGO_ATLAS_PW + '@g2ss-nomph.mongodb.net/G2SS_v1?retryWrites=true',{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

mongoose.connection.once('open',function() {
    console.log('Connection to DB has been made');
}).on('error', function(error) {
    console.log('DB Connection error',error);
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

module.exports = app;