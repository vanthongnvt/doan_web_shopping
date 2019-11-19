var express = require('express');
var productModel= require('../../models/product');
var categoryModel = require('../../models/category');

exports.index = function(req,res,next){
	categoryModel.find({'isAccessories':false},function(err,categories){
		if(err){
			return res.send('503');
		}
		else{
			categories.forEach(function(category, index){
				productModel.find({categoryId:category._id}).limit(3).exec(function(err,products){
					if(err){
						return res.send('503');
					}
					else{
						categories[index].products=products;
						if(index==categories.length-1){
							return res.render('./customer/index',{data:categories});
						}
					}
				})
			});
		}
	});
}

exports.contact = function(req,res,next){
	res.render('./customer/contact');
}

exports.about = function(req,res,next){
	res.render('./customer/about');
}