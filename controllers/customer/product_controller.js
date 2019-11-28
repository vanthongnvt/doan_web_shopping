var express = require('express');
var productModel= require('../../models/product');

exports.detail = async function(req,res,next){
	let product=req.params.product;
	let category=req.params.category;
	let result = await productModel.getProductByName(product);
	if(!result.error){
		if(result.data!=null&&result.data.categoryId.slug==category){
			res.render('./customer/single',{product:result.data});
		}
		else{
			return res.send('404');
		}
	}
	else{
		return res.send('500');
	}
}