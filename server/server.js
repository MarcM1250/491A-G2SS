const https = require('http');
const app = require('./app');
const logger = require('./api/utils/logger');

const port = process.env.PORT || 3000;

/*
const server = https.createServer({
    key: fs.readFileSync('./hidden/key.pem'),
    cert: fs.readFileSync('./hidden/cert.pem'),
    passphrase: 'secretPhrase'
}, app);
*/

const server = https.createServer(app);

server.listen(port, function() {
    logger.info(`[${new Date().toUTCString()}] - Server started on port ${port}`);
    // console.log('Server started on port ' + port);
});