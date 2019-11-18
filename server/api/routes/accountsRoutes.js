const express = require('express');
const router = express.Router();

const Authentication = require('../middleware/authentication');
const AccountsController = require('../controllers/accountsController');

// get all accounts from the database
router.get('/', Authentication.check_admin, AccountsController.get_all);
// get a single account from the database
router.get('/:username', Authentication.check_admin, AccountsController.get_account);
// create an account
router.post('/create', Authentication.check_admin, AccountsController.create_account);
// get a authentication token
router.post('/login', AccountsController.login);
// delete an account from the database
router.delete('/:username', Authentication.check_admin, AccountsController.delete_account);

module.exports = router;