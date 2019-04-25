const express = require('express');
const router = express.Router();
const gridfs = require('../middleware/gridfs');

const Authentication = require('../middleware/authentication');
const DownloadsController = require('../controllers/downloadsController');

router.get('/', Authentication.check_user, DownloadsController.get_all);
router.post('/:uploadId', Authentication.check_user, DownloadsController.create_download, gridfs.download_file);
router.get('/:username', Authentication.check_user, DownloadsController.get_download);

module.exports = router;