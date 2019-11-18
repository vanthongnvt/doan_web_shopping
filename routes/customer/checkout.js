var express = require('express');
var router = express.Router();
var checkoutController=require('../../controllers/customer/checkout_controller');

router.get('/', checkoutController.checkout);

module.exports = router;