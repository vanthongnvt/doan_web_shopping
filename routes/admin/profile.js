var express = require('express');
var router = express.Router();
const userController = require('../../controllers/admin/user_controller');


router.get('/', userController.profile);

router.post('/update-info',userController.adminUpdateInfo);

module.exports = router;
