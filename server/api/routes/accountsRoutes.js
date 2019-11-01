const express = require('express');
const router = express.Router();
const Authentication = require('../middleware/authentication');
const AccountsController = require('../controllers/accountsController');

// Get all accounts from the database
router.get('/', Authentication.check_admin, AccountsController.get_all);

// Reset counter
router.post('/unblock/:userid', Authentication.check_admin, AccountsController.unblockUser);

// Create an account
router.post('/create', Authentication.check_admin, AccountsController.create_account);

// Edit an account
router.post('/update', Authentication.check_admin, AccountsController.edit_account);

// Get one user's info
router.get('/info/:userid', Authentication.check_admin, AccountsController.info_account);

// Get a authentication token
router.post('/login', AccountsController.login);

// Delete an account from the database
router.delete('/delete/:userid', Authentication.check_admin, AccountsController.delete_account);

module.exports = router;