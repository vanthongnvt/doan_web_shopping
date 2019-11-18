var express = require('express');
var productModel= require('../../models/product');

exports.detail = function(req,res,next){
	// productModel.find({},function(err,products){
		
	// })
  	res.render('./customer/single');
}