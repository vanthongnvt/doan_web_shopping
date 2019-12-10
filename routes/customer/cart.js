var express = require('express');
var router = express.Router();
var cartController=require('../../controllers/customer/cart_controller');

router.get('/add-to-cart/:id', cartController.addToCart);
router.get('/remove-from-cart/:id',cartController.removeFromCart);
router.get('/increase-qty/:id',cartController.increaseQty);
module.exports = router;
