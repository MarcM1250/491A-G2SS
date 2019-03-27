const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Parse POST requests made to server
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Recieve a POST request and print it to console
app.post('/api/message', (req, res) => {
    console.log(req.body);
    res.status(200);
});

const server = app.listen(5000, () => {
    console.log(`Listening on port ${server.address().port}`);
});