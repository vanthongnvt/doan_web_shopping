var express = require('express');
var router = express.Router();

var accountController=require('../../controllers/customer/account_controller');

router.get('/',accountController.userInfo);

module.exports = router;
