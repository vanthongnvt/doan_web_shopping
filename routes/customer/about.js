var express = require('express');
var router = express.Router();
var homeController=require('../../controllers/customer/home_controller');
const getMenu = require('../../middleware/get_menu');

router.get('/',getMenu,homeController.about);

module.exports = router;