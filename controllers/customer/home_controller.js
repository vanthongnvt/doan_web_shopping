var express = require('express');
var productModel= require('../../models/product');
var categoryModel = require('../../models/category');

exports.index = function(req,res,next){

	// categoryModel.find().populate({path:'products',options:{limit:3,sort:{created:1}}}).exec(function(err,result){
	// 	if(err){
	// 		return res.send('503');
	// 	}
	// 	else{
	// 		console.log(result);
	// 		// return res.render('./customer/index',{data:result});
	// 	} 
	// })
	
	categoryModel.aggregate([{
		$match: {
			isAccessories: false,
		}
	},
	{
		$sort: {
			created: -1,
		}
	},
	{
		$lookup: {
			from: "products",
			as: "products",
			let: { indicator_id: '$_id' },
			pipeline: [
			{ 
				$match: {
					$expr: { $eq: [ '$categoryId', '$$indicator_id' ] }
				}
			},
			{ $limit: 4 }
			]
		}
	},
	]).exec(function(err, result){
		if(err){
			return res.send('503');
		}
		else{
			// console.log(result);
			return res.render('./customer/index',{data:result});
		}
	})
}

exports.contact = function(req,res,next){
	res.render('./customer/contact');
}

exports.about = function(req,res,next){
	res.render('./customer/about');
}