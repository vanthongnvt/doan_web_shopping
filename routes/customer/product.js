var express = require('express');
var router = express.Router({ mergeParams : true });
const getMenu = require('../../middleware/get_menu');

var productController=require('../../controllers/customer/product_controller');
router.get('/',getMenu,productController.detail);

module.exports = router;
