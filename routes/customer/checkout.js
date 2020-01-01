var express = require('express');
var router = express.Router();
var checkoutController=require('../../controllers/customer/checkout_controller');
const getMenu = require('../../middleware/get_menu');

router.get('/', getMenu,checkoutController.checkout);

module.exports = router;