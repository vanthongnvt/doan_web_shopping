var express = require('express');
var router = express.Router();
var homeController=require('../../controllers/customer/home_controller');

/* GET home page. */
router.get('/', homeController.index);

module.exports = router;
