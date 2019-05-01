const express = require('express');
const router = express.Router();

const Authentication = require('../middleware/authentication');
const UploadsController = require('../controllers/uploadsController');
const gridfs = require('../middleware/gridfs');

// Get all uploads from the database
router.get('/', UploadsController.get_all);
// Upload a file to the database and create an upload
router.post('/', Authentication.check_user, gridfs.start_upload.single('file'), UploadsController.create_upload);
// Get a single upload from the database
router.get('/:uploadId', Authentication.check_user, UploadsController.get_upload);
// Patch an upload (NEED MORE WORK!)
router.patch('/:uploadId', Authentication.check_user, UploadsController.patch_upload);
// DELETE an upload from the database
router.delete('/:uploadId', Authentication.check_user, UploadsController.delete_upload, gridfs.delete_file);

module.exports = router;