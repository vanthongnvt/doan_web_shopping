var express = require('express');
var productModel= require('../../models/product');
// var Cart =  require('../../models/cart');
exports.checkout = function(req,res,next){
	// let cart = new Cart(req.session.cart?req.session.cart:{});
	let messages = req.flash('messages')[0]||{};
	let old = req.flash('old')[0]||{};
	// console.log(messages);
	
	res.render('./customer/checkout',{messages:messages,old:old});
}