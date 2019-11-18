var express = require('express');
var router = express.Router();
var homeController=require('../../controllers/customer/home_controller');

router.get('/', homeController.contact);

module.exports = router;