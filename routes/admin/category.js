var express = require('express');
var router = express.Router();
//var Category = require('../../models/category');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopinerAdmin', { useNewUrlParser: true, useUnifiedTopology: true })



router.get('/danh-sach', function (req, res, next) {
	const data = [{ name: 'Quần áo', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Dày dép', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Vũ khí', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Thảo dược', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Thực phẩm', dateCreated: '12/12/2012', status: 'Đóng' },
	{ name: 'Bí kíp võ công', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Điện thoại', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Laptop', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Linh đan', dateCreated: '12/12/2012', status: 'Đóng' },
	{ name: 'Đạo cụ', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Dày dép', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Vũ khí', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Thảo dược', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Thực phẩm', dateCreated: '12/12/2012', status: 'Đóng' },
	{ name: 'Bí kíp võ công', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Điện thoại', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Laptop', dateCreated: '12/12/2012', status: 'Mở' },
	{ name: 'Linh đan', dateCreated: '12/12/2012', status: 'Đóng' },
	{ name: 'Đạo cụ', dateCreated: '12/12/2012', status: 'Mở' }
	]
	res.render('./admin/category-list', { categories: data });
});

router.get('/them', function (req, res, next) {
	res.render('./admin/category-add');
});

// router.post('/them', function (req, res, next) {
// 	var ele = document.getElementsByName('radio');
// 	var getstatus = "Mở"
// 	for (i = 0; i < ele.length; i++) {
// 		if (ele[i].checked) {
// 			status = ele[i].value;
// 		}
// 	}
// 	var item = {
// 		name: req.body.category.name,
// 		slug: req.body.category.name,
// 		status: getstatus
// 	};

// 	var data = new Category(item);

// 	Category.save(data);

// 	res.redirect("/gian-hang/danh-sach");
// })

module.exports = router;
