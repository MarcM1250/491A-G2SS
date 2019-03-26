const express = require('express');
const router = express.Router();

const Authentication = require('../middleware/authentication');
const AccountsController = require('../controllers/accountsController');

router.get('/', Authentication.check_user, AccountsController.get_all);
router.get('/:username', Authentication.check_user, AccountsController.get_account);
router.post('/create', AccountsController.create_account);
router.post('/login', AccountsController.login);
router.delete('/:username', AccountsController.delete_account);

module.exports = router;