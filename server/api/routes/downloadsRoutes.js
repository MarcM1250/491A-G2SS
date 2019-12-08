const express = require('express');
const router = express.Router();

const Authentication = require('../middleware/authentication');
const DownloadsController = require('../controllers/downloadsController');

// get all downloads from the database
router.get('/', Authentication.check_admin, DownloadsController.get_all);
// download a file and create an download record
router.post('/:uploadId', Authentication.check_user, DownloadsController.create_download);
// get all downloads made by a single user
router.get('/:uploadId', Authentication.check_admin, DownloadsController.get_download);

module.exports = router;
