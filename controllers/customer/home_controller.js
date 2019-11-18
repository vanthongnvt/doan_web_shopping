var express = require('express');
var productModel= require('../../models/product');

exports.index = function(req,res,next){
	// productModel.find({},function(err,products){
		
	// })
  	res.render('./customer/index');
}

exports.contact = function(req,res,next){
	res.render('./customer/contact');
}

exports.about = function(req,res,next){
	res.render('./customer/about');
}