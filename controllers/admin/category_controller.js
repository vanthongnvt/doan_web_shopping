const express = require('express');
const categoryModel = require('../../models/category');
const brandModel = require('../../models/brand');
const productModel = require('../../models/product');
var slug = require('slug');
var mongoose = require('mongoose');

var MAX_PAGE_SIZE = 10;

exports.listCategory = async function (req, res, next) {

	let page = 1, pageSize = MAX_PAGE_SIZE, findObj = {};
	let url = req.baseUrl + req.path  + '?';
	let query = req.query;
	if (query.page) {
		page = parseInt(req.query.page);
		delete query.page;
	}
	if (query.q != null) {
		url = url + '&q=' + query.q;
		findObj.name = { '$regex': query.q, '$options': 'i' };
	}
	if (query.isAccessories != null) {
		url = url + '&isAccessories=' + query.isAccessories;
		findObj.isAccessories = query.isAccessories;
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
		else if (query.sort == 'isAccessories') {
			sort = { isAccessories: -1 };
		}
		else if (query.sort == 'status') {
			sort = { status: -1 };
		}
		else {
			sort = { created: -1 };
		}
	}
	let rsCount = await categoryModel.countCategory(findObj);
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
		let rsList = await categoryModel.listCategory(findObj, page, pageSize, sort);
		if (rsList.error) {
			return res.send({ error: true, messsage: 'server error' });
		}
		else {
			let pagination = { totalPage: parseInt(count / pageSize) + 1, curPage: page, totalItem: count, url: url };
			return res.render('./admin/category-list', { categories: rsList.data, pagination: pagination, query: query });
		}
	}

}

exports.addCategoryPage = function (req, res, next) {
	let data = req.flash('item')[0] || {};
	let errorData = req.flash('errorItem')[0] || {};
	res.render('./admin/category-add', { data: data, dataError: errorData });
}

exports.createCategory = async function (req, res, next) {
	var rqStatus = false;
	var rqisAcccessories = false;
	var statusRadio = req.body.radioStatus;
	if (statusRadio === "Mở") {
		rqStatus = true;
	}
	var isAccessoriesRadio = req.body.isAccessoriesRadio;
	if (isAccessoriesRadio == 'Phụ kiện') {
		rqisAcccessories = true;
	}
	var item = {
		name: req.body.name,
		slug: slug(req.body.name, { lower: true }),
		status: rqStatus,
		isAccessories: rqisAcccessories
	}
	var errorItem = {};
	var checkSlug = await categoryModel.findOne({slug: item.slug}).exec();
	if (item.name.toString().trim() == "") {
		errorItem.msg_noName = "Bạn chưa nhập tên gian hàng";
		req.flash('item', item);
		req.flash('errorItem', errorItem);
		// console.log(item);
		res.redirect('/admin/gian-hang/them');
	}
	else if(checkSlug != null){
		errorItem.msg_noName = "Tên gian hàng bạn nhập đã tồn tại";
		req.flash('item', item);
		req.flash('errorItem', errorItem);
		// console.log(item);
		res.redirect('/admin/gian-hang/them');
	}
	else {
		var data = new categoryModel(item);
		data.save();
		res.redirect('/admin/gian-hang/danh-sach');
	}

}

exports.editCategoryPage = async function (req, res, next) {
	var id = req.params.id;
	let itemdata = req.flash('item')[0] || null;
	// console.log(itemdata);
	let errorData = req.flash('errorItem')[0] || {};


	if (itemdata == null) {
		var findObj = await categoryModel.findOne({ _id: id }).exec();
		// console.log(findObj);
		res.render('./admin/category-edit', { data: findObj, dataError: errorData });
	}
	else {
		// console.log(itemdata);
		res.render('./admin/category-edit', { data: itemdata, dataError: errorData });
	}
}

exports.updateCategory = async function (req, res, next) {
	var id = req.body.id;
	// console.log(id);
	var errorItem = {};
	var findObj = await categoryModel.findOne({ _id: id }).exec();
	var oldSlug = findObj.slug;
	// console.log(findObj);
	findObj.name = req.body.name;
	findObj.slug = slug(findObj.name, { lower: true });
	if (req.body.radioStatus === "Mở") {
		findObj.status = true;
	}
	else {
		findObj.status = false;
	}
	if (req.body.isAccessoriesRadio == 'Phụ kiện') {
		findObj.isAccessories = true;
	}
	else {
		findObj.isAccessories = false;
	}
	// console.log(findObj);
	var checkSlug = await categoryModel.findOne({slug: findObj.slug}).exec();
	
	if (findObj.name.toString().trim() == "") {
		errorItem.msg_noName = "Bạn chưa nhập tên gian hàng";
		req.flash('item', findObj);
		req.flash('errorItem', errorItem);
		res.redirect('/admin/gian-hang/sua/' + id);
	}
	else if(findObj.slug != oldSlug && checkSlug != null){
		errorItem.msg_noName = "Tên gian hàng bạn nhập đã tồn tại";
		req.flash('item', findObj);
		req.flash('errorItem', errorItem);
		res.redirect('/admin/gian-hang/sua/' + id);
	}
	else {
		findObj.save();
		res.redirect('/admin/gian-hang/danh-sach');
	}

}

exports.changeCategoryStatus = async function(req,res,next){
	let status = req.body.status;
	let id = req.body.id;
	if(status==null||id==null){
		return res.send({error:true,messsage:'invalid params'});
	}

	let result = await categoryModel.findById(id);
	result.status = status; 
	result.save();
	if(result.error){
		return res.send({error:true,messsage:'server error'});
	}
	return res.send({error:false, messsage:'successfull'});

}

exports.changeIsAccessories = async function(req,res,next){
	let data = req.body.data;
	// console.log('data: '+data);
	let id = req.body.id;
	// console.log('id: '+id);
	if(data==null||id==null){
		return res.send({error:true,messsage:'invalid params'});
	}

	let result = await categoryModel.findById(id);
	result.isAccessories = data; 
	result.save();
	if(result.error){
		return res.send({error:true,messsage:'server error'});
	}
	return res.send({error:false, messsage:'successfull'});

}

exports.deleteCategory = async function(req,res,next){
	let id = req.body.id;
	if(id==null){
		return res.send({error:true,messsage:'invalid params'});
	}
	let deleteProductsInCategory = await productModel.deleteMany({categoryId: id});
	if(deleteProductsInCategory.error){
		return res.send({error:true,messsage:'server error'});
	}
	else{
		// console.log('da xoa san  pham');
		let deleteBrandsInCategory = await brandModel.deleteMany({categoryId: id});
		if(deleteBrandsInCategory.error){
			return res.send({error:true,messsage:'server error'});
		}
		// console.log('da xoa hang san xuat');
		let result = await categoryModel.findByIdAndRemove(id);
		if(result.error){
			return res.send({error:true,messsage:'server error'});
		}
		// console.log('da xoa gian hang');
		return res.send({error:false, messsage:'successfull'});
	}
	

}


