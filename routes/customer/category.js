var express = require('express');
var router = express.Router({ mergeParams : true });
const getMenu = require('../../middleware/get_menu');

var categoryController=require('../../controllers/customer/category_controller');
router.get('/',getMenu,categoryController.listProduct);

module.exports = router;
