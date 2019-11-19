var express = require('express');
var productModel= require('../../models/product');

exports.detail = function(req,res,next){
	let product=req.params.product;
	let category=req.params.category;
	productModel.findOne({slug:product}).populate('categoryId').exec(function(err,product){
		if(err){
			return res.send('503');
		}
		else{
			// console.log(product);
			if(product!=null&&product.categoryId.slug==category){
				res.render('./customer/single',{product:product});
			}
			else{
				return res.send('404');
			}
		}
	})
}