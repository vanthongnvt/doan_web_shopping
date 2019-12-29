const express = require('express');
const brandModel = require('../../models/brand');
const categoryModel = require('../../models/category');
var slug = require('slug');
var mongoose = require('mongoose');
var db = mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }, function (err) {
	if (err) {
		console.log(err);
	}
});

var MAX_PAGE_SIZE = 100;
exports.listBrand = async function (req, res, next) {

	let page = 1, pageSize = MAX_PAGE_SIZE, findObj = {};
	let categoryList = await categoryModel.all();
	if (categoryList.error) {
		return res.render('./admin/404');
	}
	else {
		categoryList = categoryList.data;
	}
	let url = req.baseUrl + req.path + '?page=';
	let query = req.query;
	if (query.page) {
		page = parseInt(req.query.page);
		delete query.page;
	}
	if (query.q != null) {
		url = url + '&q=' + query.q;
		findObj.name = { '$regex': query.q, '$options': 'i' };
	}
	if (query.categoryId) {
		url = url + '&categoryId=' + query.categoryId;
		findObj.categoryId = query.categoryId;
	}
	let sort = { created: -1 };
	if (query.sort != null) {
		url = url + '&sort=' + query.sort;
		if (query.sort == 'name') {
			sort = { slug: 1 };
		}
		else if (query.sort == 'product') {
			sort = { numProducts: -1 };
		}
		else if (query.sort == 'status') {
			sort = { status: -1 };
		}
		else {
			sort = { created: -1 };
		}
	}
	let rsCount = await brandModel.countBrand(findObj);
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
		let rsList = await brandModel.listBrand(findObj, page, pageSize, sort);
		if (rsList.error) {
			return res.send({ error: true, messsage: 'server error' });
		}
		else {
			let pagination = { totalPage: parseInt(count / pageSize) + 1, curPage: page, totalItem: count, url: url };
			return res.render('./admin/brand-list', { brands: rsList.data, categoryList: categoryList, pagination: pagination, query: query });
		}
	}

}

exports.addBrandPage = async function (req, res, next) {
	let page = 1, pageSize = MAX_PAGE_SIZE, findObj = {};
	let sort = { created: -1 };
	let rsList = await categoryModel.listCategory(findObj, page, pageSize, sort);
	if (rsList.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	else {
		let item =  req.flash('item')[0]||{};
		let errorItem = req.flash('errorItem')[0]||{};
		return res.render('./admin/brand-add', { categoriesSelect: rsList.data , data: item, dataError: errorItem});
	}
}

exports.createBrand = async function (req, res, next) {
	var rqStatus = false;
	var statusRadio = req.body.radioStatus;
	if (statusRadio === "Mở") {
		rqStatus = true;
	}
	var item = {
		name: req.body.name,
		categoryId: req.body.categorySelect,
		slug: slug(req.body.name, { lower: true }),
		status: rqStatus,
	}
	
	var errorItem = {};
	var checkInput = true;
	if (item.categoryId == undefined) {
		checkInput = false;
		errorItem.msg_noCategory = 'Bạn chưa chọn gian hàng';
	}
	if (item.name == ""){
		checkInput = false;
		errorItem.msg_noName = 'Bạn chưa nhập tên hãng';
	}
	console.log(checkInput);
	console.log(errorItem);
	if(checkInput == false){
		req.flash('item', item);
		req.flash('errorItem', errorItem);
		res.redirect('/admin/hang-sx/them');
	}
	else {
		var data = new brandModel(item);
		data.save();
		res.redirect('/admin/hang-sx/danh-sach');
	}
}

exports.editbrandPage = async function (req, res, next) {
	let page = 1, pageSize = MAX_PAGE_SIZE, findObj = {};
	let sort = { created: -1 };
	let rsList = await categoryModel.listCategory(findObj, page, pageSize, sort);
	if (rsList.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	else {
		let item =  req.flash('item')[0]||null;
		let errorItem = req.flash('errorItem')[0]||{};
		if(item == null){
			var id = req.params.id;
			var updateObj = await brandModel.findOne({ _id: id }).exec();
			res.render('./admin/brand-edit', { data: updateObj, categoriesSelect: rsList.data, dataError: errorItem});
		}
		else{
			console.log(item);
			res.render('./admin/brand-edit', { data: item, categoriesSelect: rsList.data, dataError: errorItem});
		}
		
	}

}

exports.updateBrand = async function (req, res, next) {
	var id = req.body._id;
	var updateItem = await brandModel.findOne({ _id: id }).exec();
	updateItem.name = req.body.name;
	updateItem.slug = slug(updateItem.name, {lower:true});
	if(req.body.radioStatus === "Mở"){
		updateItem.status = true;
	}
	else{
		updateItem.status = false;
	}
	updateItem.categoryId = req.body.categorySelect;
	var errorItem = {};
	var checkInput = true;
	if(updateItem.name.toString().trim() == ""){
		checkInput = false;
		errorItem.msg_noName = "Bạn chưa nhập tên hãng";
	}
	if(updateItem.categoryId == undefined){
		checkInput = false;
		errorItem.msg_noCategory = "Bạn chưa chọn gian hàng";
	}
	

	if(checkInput == false){
		req.flash('item', updateItem);
		req.flash('errorItem', errorItem);
		res.redirect('/admin/hang-sx/sua/' + id);
	}
	else{
		updateItem.save();
		res.redirect('/admin/hang-sx/danh-sach');
	}
}