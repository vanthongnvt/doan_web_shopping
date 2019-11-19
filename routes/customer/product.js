var express = require('express');
var router = express.Router({ mergeParams : true });

var productController=require('../../controllers/customer/product_controller');
router.get('/',productController.detail);

module.exports = router;
