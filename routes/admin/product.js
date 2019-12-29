var express = require('express');
var router = express.Router();
var productController=require('../../controllers/admin/product_controller');


router.get('/danh-sach',productController.listProduct);

router.get('/them', productController.addProductPage);

router.post('/them',productController.createProduct);

router.post('/change-status',productController.changeProductStatus);

router.get('/sua/:id',productController.editProductPage);

router.post('/update',productController.updateProduct);

router.get('/ajax/:id',productController.ajaxBrandOfCategory);

//router.post('/ajax/upload-avatar',productController.ajaxUploadAvatar);

module.exports = router;
