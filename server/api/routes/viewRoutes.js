const express = require('express');
const router = express.Router();

const DownloadsController = require('../controllers/downloadsController');

router.get('/:uploadId', DownloadsController.view_kml);
//router.get('/', UploadsController.get_all);


module.exports = router;
