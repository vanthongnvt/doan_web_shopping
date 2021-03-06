var express = require('express');
var productModel= require('../../models/product');
var Cart =  require('../../models/cart');
exports.addToCart = async function(req,res,next){
	let id = req.params.id;
	let product = await productModel.findProductById(id);
	if(product.error){
		res.status(404);
		return res.send({message:"Lối. Vui lòng thử lại sau"});
	}
	if(product.data&&product.data.status==true){
		if(product.quantity<=0){
			return res.status(404).send({message:'Sản phẩm đã hết hàng'});
		}
		let cart = new Cart(req.session.cart?req.session.cart:{});
		// console.log(cart);
		let storedItem = cart.addItem(product.data,id);
		// cart.clear();
		req.session.cart= cart;
		return res.send({message:"success",storedItem:storedItem,cart:cart});
	}
	else{
		res.status(404);
		return res.send({message:"Sản phẩm không tồn tại"});
	}
}

exports.removeFromCart = function(req,res,next){
	let id = req.params.id;
	let cart = new Cart(req.session.cart?req.session.cart:{});
	cart.removeItem(id);
	req.session.cart= cart;
	res.status(200);
	res.send({message:"success",cart:cart});
}

exports.increaseQty = function(req,res,next){
	let id = req.params.id;
	let amount= parseInt(req.query.amount);
	let cart = new Cart(req.session.cart?req.session.cart:{});
	cart.changeQty(id,amount);
	req.session.cart= cart;
	res.status(200);
	res.send({message:"success",cart:cart});
}

exports.updateCart = function(req,res,next){
	let deleteItems = JSON.parse(req.body.deleteItems);
	let updateItems = JSON.parse(req.body.updateItems);
	let cart = new Cart(req.session.cart?req.session.cart:{});
	cart.update(deleteItems,updateItems);
	req.session.cart= cart;
	res.status(200);
	res.send({message:"success",cart:cart});
}