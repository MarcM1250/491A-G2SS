const express = require('express');
const router = express.Router();

const Authentication = require('../middleware/authentication');
const UploadsController = require('../controllers/uploadsController');
const gridfs = require('../middleware/gridfs');

router.get('/', Authentication.check_user, UploadsController.get_all);
router.post('/', Authentication.check_user, gridfs.start_upload.single('file'), UploadsController.create_upload);
router.get('/:uploadId', Authentication.check_user, UploadsController.get_upload);
router.patch('/:uploadId', Authentication.check_user, UploadsController.patch_upload);
router.delete('/:uploadId', Authentication.check_user, UploadsController.delete_upload, gridfs.delete_file);

module.exports = router;