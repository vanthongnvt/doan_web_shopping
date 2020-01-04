var express = require('express');
var router = express.Router();
var brandController=require('../../controllers/admin/brand_controller');


router.get('/danh-sach',brandController.listBrand);

router.get('/them', brandController.addBrandPage);

router.post('/them',brandController.createBrand);

router.get('/sua/:id',brandController.editbrandPage);

router.post('/update',brandController.updateBrand);

router.post('/update-status',brandController.changeBrandStatus);

router.post('/delete-brand',brandController.deleteBrand);

module.exports = router;
