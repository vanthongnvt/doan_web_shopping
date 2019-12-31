var express = require('express');
const productModel = require('../../models/product');
const categoryModel = require('../../models/category');
const brandModel = require('../../models/brand');
var slug = require('slug');
var multer = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, '../../public/images/products')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

var upload = multer({ storage: storage }).single('avatar');

var MAX_PAGE_SIZE = 100
exports.listProduct = async function (req, res, next) {

	let page = 1, pageSize = MAX_PAGE_SIZE, brandList = null, findObj = {};
	let categoryList = await categoryModel.all();
	if (categoryList.error) {
		return res.render('./admin/404');
	}
	else {
		categoryList = categoryList.data;
	}
	let query = req.query;
	let url = req.baseUrl + req.path + '?';
	if (query.page) {
		page = parseInt(req.query.page);
		delete query.page;
	}
	if (query.categoryId) {
		url = url + '&categoryId=' + query.categoryId;
		findObj.categoryId = query.categoryId;
		brandList = await brandModel.getBrandsByCategory(query.categoryId);
		if (brandList.error) {
			return res.render('./admin/404');
		}
		else {
			brandList = brandList.data;
		}
	}
	if (query.brandId) {
		url = url + '&brandId=' + query.brandId;
		findObj.brandId = query.brandId;
	}
	if (query.status) {
		url = url + '&status=' + query.status;
		findObj.status = query.status;
	}
	if (query.q != null) {
		url = url + '&q=' + query.q;
		findObj.name = { '$regex': query.q, '$options': 'i' };
	}
	let sort = { created: -1 };
	if (query.sort != null) {
		url = url + '&sort=' + query.sort;
		if (query.sort == 'name') {
			sort = { slug: 1 };
		}
		else if (query.sort == 'price') {
			sort = { price: -1 };
		}
		else if (query.sort == 'qty') {
			sort = { quantity: -1 };
		}
		else if (query.sort == 'discount') {
			sort = { discount: -1 };
		}
		else if (query.sort == 'sold') {
			sort = { numberOfProductSold: -1 };
		}
		else if (query.sort == 'view') {
			sort = { view: -1 };
		}
		else if (query.sort == 'status') {
			sort = { status: -1 };
		}
		else {
			sort = { created: -1 };
		}
	}
	let rsCount = await productModel.countProduct(findObj);
	if (rsCount.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	else {
		if (Object.keys(query).length > 0) {
			url = url + '&page=';
		}
		else {
			url = url + 'page=';
		}
		let count = rsCount.count;
		let rsList = await productModel.listProduct(findObj, page, pageSize, sort);
		if (rsList.error) {
			return res.send({ error: true, messsage: 'server error' });
		}
		else {
			let pagination = { totalPage: parseInt(count / pageSize) + 1, curPage: page, totalItem: count, url: url };
			return res.render('./admin/product-list', { products: rsList.data, pagination: pagination, categoryList: categoryList, brandList: brandList, query: query });
		}
	}
}

exports.addProductPage = async function (req, res, next) {
	let page = 1, pageSize = MAX_PAGE_SIZE, findObj = {};
	let sort = { created: -1 };
	let categoryList = await categoryModel.listCategory(findObj, page, pageSize, sort);
	if (categoryList.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	else {
		let flag = req.flash('flag')[0] || null;
		console.log("flag: "+flag);
		if (flag == null) { // tao trang add ban dau
			var item = {};
			console.log("Nhan:\n");
			console.log(item);
			var categoryId = item.categoryId;
			let page = 1, pageSize = MAX_PAGE_SIZE, findObj = { categoryId: categoryId };
			let sort = { created: -1 };
			let brandList = await brandModel.listBrand(findObj, page, pageSize, sort);

			res.render('./admin/product-add', { categoriesSelect: categoryList.data, brandsSelect: brandList.data, data: item, dataError: {} });
		}
		else { // == {}, load lai trang vi nhap sai
			let item = req.flash('item')[0] || {};
			var errorItem = {};
			if (item.categoryId == undefined) {
				checkInput = false;
				errorItem.msg_noCategory = 'Bạn chưa chọn gian hàng';
			}
			if (item.brandId == undefined) {
				checkInput = false;
				errorItem.msg_noBrand = 'Bạn chưa chọn hãng';
			}
			var checkSlug = await productModel.findOne({ slug: item.slug }).exec();
			console.log(checkSlug);
			if (item.name == "") {
				checkInput = false;
				errorItem.msg_noName = 'Bạn chưa nhập tên sản phẩm';
			} else if (checkSlug != null) {
				checkInput = false;
				errorItem.msg_noName = 'Tên sản phẩm bị trùng';
			}

			if (item.price == "" || item.price == null) {
				checkInput = false;
				errorItem.msg_noPrice = 'Bạn chưa nhập giá sản phẩm';
			}
			if (item.detail == "" || item.detail == null) {
				checkInput = false;
				errorItem.msg_noDetail = 'Bạn chưa nhập mô tả sản phẩm';
			}
			if (item.quantity == "" || item.quantity == null) {
				checkInput = false;
				errorItem.msg_noQuantity = 'Bạn chưa nhập số lượng sản phẩm';
			}
			console.log(errorItem);

			console.log("Nhan:\n");
			console.log(item);
			var categoryId = item.categoryId;
			let page = 1, pageSize = MAX_PAGE_SIZE, findObj = { categoryId: categoryId };
			let sort = { created: -1 };
			let brandList = await brandModel.listBrand(findObj, page, pageSize, sort);

			res.render('./admin/product-add', { categoriesSelect: categoryList.data, brandsSelect: brandList.data, data: item, dataError: errorItem });
		}
	}
}

exports.createProduct = async function (req, res, next) {
	var errorItem = {};
	var checkInput = true;
	var item = {
		images: null,
	};

	if (req.busboy) {
		req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
			if (filename == "") {
				checkInput = false;
				errorItem.msg_noImg = "Bạn chưa chọn ảnh cho sản phẩm";
				//item.images = null;
				req.flash('item', item);
				req.flash('errorItem', errorItem);
				res.redirect('/admin/san-pham/them');
				//buggggg
			}
			else {

				fstream = fs.createWriteStream(process.cwd() + '/public/images/products/' + filename);
				file.pipe(fstream);
				fstream.on('close', function () {
					console.log("Upload Finished of " + filename);
					item.images = new Array(1);
					item.images[0] = filename;
				});
			}

		});
		req.busboy.on('field', async function (key, value, keyTruncated, valueTruncated) {
			if (key == 'name') {
				item.name = value;
			}
			else if (key == 'quantity') {
				item.quantity = value;
			}
			else if (key == 'price') {
				item.price = value;
			}
			else if (key == 'radioStatus') {
				if (value == "Open") item.status = true;
				else item.status = false;
			}
			else if (key == 'categorySelect') {
				item.categoryId = value;
			}
			else if (key == 'brandSelect') {
				item.brandId = value;
			}
			else if (key == 'detail') {
				item.detail = value;
			}
			if (item.name == null || item.name == "") item.slug = "";
			else item.slug = slug(item.name, { lower: true });


		});

		req.busboy.on('finish', async function () {
			if (item.categoryId == undefined) {
				checkInput = false;
			}
			if (item.brandId == undefined) {
				checkInput = false;
			}
			var checkSlug = await productModel.findOne({ slug: item.slug }).exec();
			console.log(checkSlug);
			if (item.name == "") {
				checkInput = false;
			} else if (checkSlug != null) {
				checkInput = false;
			}
			if (item.price == "" || item.price == null) {
				checkInput = false;
			}
			if (item.detail == "" || item.detail == null) {
				checkInput = false;
			}
			if (item.quantity == "" || item.quantity == null) {
				checkInput = false;
			}
			if (checkInput == false) {
				var flag = {};
				console.log("before flash flag: "+flag);
				req.flash('flag', flag);
				req.flash('item', item);
				res.redirect('/admin/san-pham/them');
			}
			else {
				var data = new productModel(item);
				data.save();
				res.redirect('/admin/san-pham/danh-sach');
			}
		});

		req.pipe(req.busboy);

		return;
	}


}

exports.changeProductStatus = async function (req, res, next) {

}

exports.updateQuantity = async function (req, res, next) {

}

exports.editProductPage = async function (req, res, next) {
	let page = 1, pageSize = MAX_PAGE_SIZE, findObj = {};
	let sort = { created: -1 };
	let categoryList = await categoryModel.listCategory(findObj, page, pageSize, sort);
	if (categoryList.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	else {
		let item = req.flash('item')[0] || null;
		let errorItem = req.flash('errorItem')[0] || {};
		if (item == null) { // from edit in /danh sach
			var id = req.params.id;
			let updateItem = await productModel.findOne({ _id: id }).exec();
			console.log(updateItem);
			var categoryId = updateItem.categoryId;
			let page = 1, pageSize = MAX_PAGE_SIZE, findObj = { categoryId: categoryId };
			let sort = { created: -1 };
			let brandList = await brandModel.listBrand(findObj, page, pageSize, sort);

			res.render('./admin/product-edit', { categoriesSelect: categoryList.data, brandsSelect: brandList.data, data: updateItem, dataError: errorItem });
		}
		else { // load lai vi nhap loi	
			var categoryId = item.categoryId;
			let page = 1, pageSize = MAX_PAGE_SIZE, findObj = { categoryId: categoryId };
			let sort = { created: -1 };
			let brandList = await brandModel.listBrand(findObj, page, pageSize, sort);

			res.render('./admin/product-edit', { categoriesSelect: categoryList.data, brandsSelect: brandList.data, data: item, dataError: errorItem });
		}

	}
}

exports.updateProduct = async function (req, res, next) {
	var id = req.body._id;
	console.log("id: " + id);
	var status = false;
	if (req.body.radioStatus === "Open") {
		status = true;
	}
	var item = await productModel.findOne({ _id: id }).exec();
	var oldSlug = item.slug;
	console.log("item find: " + item);

	item._id = req.body._id;
	item.price = req.body.price;
	item.quantity = req.body.quantity;
	item.status = status;
	item.name = req.body.name;
	item.slug = slug(req.body.name, { lower: true });
	item.categoryId = req.body.categorySelect;
	item.brandId = req.body.brandSelect;
	item.detail = req.body.detail;
	item.image = null;

	console.log(item);
	var errorItem = {};
	var checkInput = true;
	if (item.categoryId == undefined) {
		checkInput = false;
		errorItem.msg_noCategory = 'Bạn chưa chọn gian hàng';
	}
	if (item.brandId == undefined) {
		checkInput = false;
		errorItem.msg_noBrand = 'Bạn chưa chọn hãng';
	}
	var checkSlug = await productModel.findOne({ slug: item.slug }).exec();
	console.log(checkSlug);
	if (item.name == "" || item.name == null) {
		checkInput = false;
		errorItem.msg_noName = 'Bạn chưa nhập tên sản phẩm';
	} else if (item.slug != oldSlug && checkSlug != null) {
		checkInput = false;
		errorItem.msg_noName = 'Tên sản phẩm bị trùng';
	}

	if (item.price == "" || item.price == null) {
		checkInput = false;
		errorItem.msg_noPrice = 'Bạn chưa nhập giá sản phẩm';
	}
	if (item.detail == "" || item.detail == null) {
		checkInput = false;
		errorItem.msg_noDetail = 'Bạn chưa nhập mô tả sản phẩm';
	}
	if (item.quantity == "" || item.quantity == null) {
		checkInput = false;
		errorItem.msg_noQuantity = 'Bạn chưa nhập số lượng sản phẩm';
	}
	console.log(checkInput);
	console.log(errorItem);
	if (checkInput == false) {
		req.flash('item', item);
		req.flash('errorItem', errorItem);
		res.redirect('/admin/san-pham/sua/' + item._id);
	}
	else {
		item.save();
		res.redirect('/admin/san-pham/danh-sach');
	}
}

exports.ajaxBrandOfCategory = async function (req, res, next) {
	var id = req.params.id;
	let page = 1, pageSize = MAX_PAGE_SIZE, findObj = { categoryId: id };
	let sort = { created: -1 };
	let brandList = await brandModel.listBrand(findObj, page, pageSize, sort);
	if (brandList.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	else {
		return res.send(brandList.data);
	}
}
