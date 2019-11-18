var express = require('express');
var router = express.Router();

var categoryController=require('../../controllers/customer/category_controller');
/* GET home page. */
router.get('/',categoryController.listProduct);

module.exports = router;
