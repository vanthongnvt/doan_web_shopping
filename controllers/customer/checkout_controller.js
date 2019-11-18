var express = require('express');
var productModel= require('../../models/product');

exports.checkout = function(req,res,next){
	res.render('./customer/checkout');
}