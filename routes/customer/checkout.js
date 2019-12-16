var express = require('express');
var router = express.Router();
var authRedirectMiddleware=require('../../middleware/auth_redirect');
var checkoutController=require('../../controllers/customer/checkout_controller');

router.get('/', checkoutController.checkout);

module.exports = router;