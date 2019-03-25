const express = require('express');
const router = express.Router();

const Authentication = require('../middleware/authentication');
const UsersController = require('../controllers/usersController');

router.get('/', UsersController.get_all);
router.post('/signup', UsersController.signup);
router.post('/login', UsersController.login);
router.delete('/:username', UsersController.delete);

module.exports = router;