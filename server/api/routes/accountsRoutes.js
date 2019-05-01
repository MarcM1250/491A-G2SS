const express = require('express');
const router = express.Router();

const Authentication = require('../middleware/authentication');
const AccountsController = require('../controllers/accountsController');

// Get all accounts from the database
router.get('/', AccountsController.get_all);
// Get a single account from the database
router.get('/:username', Authentication.check_user, AccountsController.get_account);
// Create an account
router.post('/create', AccountsController.create_account);
// Get a authentication token
router.post('/login', AccountsController.login);
// Delete an account from the database
router.delete('/:username', AccountsController.delete_account);

module.exports = router;