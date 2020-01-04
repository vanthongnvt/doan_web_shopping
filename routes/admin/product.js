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

router.post('/update-status',productController.changeProductStatus);

router.post('/update-quantity',productController.updateProductQuantity);

router.post('/update-price',productController.updateProductPrice);

router.post('/update-discount',productController.updateProductDiscount);

router.post('/delete-product',productController.deleteProduct);

module.exports = router;
