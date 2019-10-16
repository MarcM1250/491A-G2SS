const express = require('express');
const router = express.Router();

const Authentication = require('../middleware/authentication');
const DownloadsController = require('../controllers/downloadsController');

// Get all downloads from the database
router.get('/', Authentication.check_admin, DownloadsController.get_all);
// Download a file and create an download
router.post('/:uploadId', Authentication.check_admin, DownloadsController.create_download);
// Get all download made by a single user
router.get('/:username', Authentication.check_admin, DownloadsController.get_download);

module.exports = router;
