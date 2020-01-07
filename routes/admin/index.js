var express = require('express');
var router = express.Router();
var checkAdmin = require('../../middleware/is_admin');

var homeController =require('../../controllers/admin/home_controller');

router.get('/',checkAdmin,homeController.dashboard);

router.get('/login',homeController.loginPage);

router.post('/login',homeController.login);

router.get('/logout',homeController.logOut);

router.get('/update-password',checkAdmin,homeController.updatePasswordPage);

router.post('/update-password',checkAdmin,homeController.updatePassword);

module.exports = router;
