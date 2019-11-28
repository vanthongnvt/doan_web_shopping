var express = require('express');
var productModel= require('../../models/product');
var categoryModel = require('../../models/category');

exports.index = async function(req,res,next){
	var show_login=false;
	// console.log(req.flash('req_login'));
	if(req.flash('req_login').length!=0){
		show_login=true;
	}
	
	var result= await categoryModel.getNewProduct();
	if(!result.error){
		return res.render('./customer/index',{data:result.data,show_login:show_login});
	}
	return res.send('500');
}

exports.contact = function(req,res,next){
	res.render('./customer/contact');
}

exports.about = function(req,res,next){
	res.render('./customer/about');
}