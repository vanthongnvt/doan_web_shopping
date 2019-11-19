var express = require('express');
var productModel= require('../../models/product');
var categoryModel= require('../../models/category');

exports.listProduct = function(req,res,next){
	console.log(req.params);
	let category = req.params.category;
	// console.log(category);
	categoryModel.findOne({slug:category}).exec(function(err,cate){
		if(err){
			return res.send('503');
		}
		else{
			if(cate!=null){
				productModel.find({categoryId:cate._id},function(err,products){
					if(err){
						return res.send('503');
					}
					else{
						return res.render('./customer/product',{category:cate,products:products});
					}
				})
			}
			else{
				return res.send('404');
			}
		}
	});
}