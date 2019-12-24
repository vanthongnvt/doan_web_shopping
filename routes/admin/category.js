var express = require('express');
var router = express.Router();
var categoryController=require('../../controllers/admin/category_controller');


router.get('/danh-sach',categoryController.listCategory);

router.get('/them', categoryController.addCategoryPage);

router.post('/them',categoryController.createCategory);

// router.post('/change-status',categoryController.changeCategoryStatus);

// router.get('/sua/:id',categoryController.editCategoryPage);

// router.post('/update',categoryController.updateCategory);

module.exports = router;
