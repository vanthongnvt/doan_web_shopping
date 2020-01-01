var express = require('express');
var router = express.Router();
var homeController=require('../../controllers/customer/home_controller');
const getMenu = require('../../middleware/get_menu');

/* GET home page. */
router.get('/',getMenu,homeController.index);

module.exports = router;
