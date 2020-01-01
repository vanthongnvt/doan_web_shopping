var express = require('express');
var router = express.Router();
var orderController=require('../../controllers/admin/order_controller');


router.get('/danh-sach',orderController.listOrder);

router.post('/update-status',orderController.changeOrderStatus);

router.post('/mark-as-seen',orderController.markAsSeen);

router.get('/chi-tiet/:id',orderController.orderDetail);

module.exports = router;
