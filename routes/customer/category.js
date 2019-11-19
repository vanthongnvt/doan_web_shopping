var express = require('express');
var router = express.Router({ mergeParams : true });

var categoryController=require('../../controllers/customer/category_controller');
router.get('/',categoryController.listProduct);

module.exports = router;
