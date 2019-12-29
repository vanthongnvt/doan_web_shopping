var express = require('express');
const productModel = require('../../models/product');
const categoryModel = require('../../models/category');
const brandModel = require('../../models/brand');
var slug = require('slug');

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
		let item =  req.flash('item')[0]||{};
		let errorItem = req.flash('errorItem')[0]||{};
		console.log("Nhan:\n");
		console.log(item);
		console.log(errorItem);
		res.render('./admin/product-add', { categoriesSelect: categoryList.data, data: item, dataError: errorItem });
	}
}

exports.createProduct = async function (req, res, next) {
	var status = false;
	if (req.body.radioStatus === "Open") {
		status = true;
	}
	var item = {
		price: req.body.price,
		quantity: req.body.quantity,
		status: status,
		name: req.body.name,
		slug: slug(req.body.name, { lower: true }),
		categoryId: req.body.categorySelect,
		brandId: req.body.brandSelect,
		detail: req.body.detail,
		image: null
	}
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
	if (item.name == ""){
		checkInput = false;
		errorItem.msg_noName = 'Bạn chưa nhập tên sản phẩm';
	}
	if (item.price == ""){
		checkInput = false;
		errorItem.msg_noPrice = 'Bạn chưa nhập giá sản phẩm';
	}
	if(item.detail == ""){
		checkInput = false;
		errorItem.msg_noDetail = 'Bạn chưa nhập mô tả sản phẩm';
	}
	console.log(checkInput);
	console.log(errorItem);
	if(checkInput == false){
		req.flash('item', item);
		req.flash('errorItem', errorItem);
		res.redirect('/admin/san-pham/them');
	}
	else {
		var data = new productModel(item);
		data.save();
		res.redirect('/admin/san-pham/danh-sach');
	}

}

exports.changeProductStatus = async function (req, res, next) {

}

exports.updateQuantity = async function (req, res, next) {

}

exports.editProductPage = async function (req, res, next) {

}

exports.updateProduct = async function (req, res, next) {

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
