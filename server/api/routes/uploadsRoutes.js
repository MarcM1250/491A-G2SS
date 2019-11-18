const express = require('express');
const router = express.Router();

const Authentication = require('../middleware/authentication');
const UploadsController = require('../controllers/uploadsController');

const multer = require('multer');
const path = require('path');

// stores the file in memory as Buffer Object
const storage = multer.memoryStorage();

// control which files should be uploaded
// any file with a 'kml' extension should be uploaded
const fileFilter = (req, file, cb) => {
  // reject a file
  if (path.extname(file.originalname) === '.kml') {
    cb(null, true);
  } else {
    const error = new Error('File upload only supports kml filetype');
    error.status = 415;
    cb(error);
  }
};

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 1024 * 1024 * 5 // specify a size limit of 5mb
  },
  fileFilter: fileFilter
});


// get all uploads from the database
router.get('/', Authentication.check_user, UploadsController.get_all);
// upload a file to the database and create an upload
router.post('/', Authentication.check_user, upload.single('file'), UploadsController.create_upload);
// get a single upload from the database
router.get('/:uploadId', Authentication.check_user, UploadsController.get_upload);
// delete an upload from the database
router.delete('/:uploadId', Authentication.check_user, UploadsController.delete_upload);

module.exports = router;

