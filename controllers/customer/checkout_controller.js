var express = require('express');
var productModel= require('../../models/product');
// var Cart =  require('../../models/cart');
exports.checkout = function(req,res,next){
	// let cart = new Cart(req.session.cart?req.session.cart:{});

	res.render('./customer/checkout');
}