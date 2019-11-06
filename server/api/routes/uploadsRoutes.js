const express = require('express');
const router = express.Router();

const Authentication = require('../middleware/authentication');
const UploadsController = require('../controllers/uploadsController');

const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, './uploads/');
//     },
//     filename: function(req, file, cb) {
//       cb(null, Date.now() + file.originalname);
//     }
//   });

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
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });


// Get all uploads from the database
router.get('/', Authentication.check_user, UploadsController.get_all);
//router.get('/:number', Authentication.check_user, UploadsController.get_some);
// Upload a file to the database and create an upload
router.post('/', Authentication.check_user, upload.single('file'), UploadsController.create_upload);
// Get a single upload from the database
router.get('/:uploadId', Authentication.check_user, UploadsController.get_upload);
// DELETE an upload from the database
router.delete('/:uploadId', Authentication.check_user, UploadsController.delete_upload);

module.exports = router;

