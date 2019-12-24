var express = require('express');
var router = express.Router();
var userController=require('../../controllers/admin/user_controller');


router.get('/danh-sach',userController.listUser);

router.post('/block',userController.blockUser);

router.get('/lich-su-mua-hang',userController.userOrderHistory);

module.exports = router;
