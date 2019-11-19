const express = require('express');
const productModel= require('../../models/product');
const categoryModel= require('../../models/category');
const brandModel=require('../../models/brand');

exports.listProduct = function(req,res,next){
	let category = req.params.category;
	let query=req.query;
	// let category = req.params.category;
	// console.log(category);
	// categoryModel.findOne({slug:category}).exec(function(err,cate){
	// 	if(err){
	// 		return res.send('503');
	// 	}
	// 	else{
	// 		if(cate!=null){
	// 			productModel.find({categoryId:cate._id},function(err,products){
	// 				if(err){
	// 					return res.send('503');
	// 				}
	// 				else{
	// 					return res.render('./customer/product',{category:cate,products:products});
	// 				}
	// 			})
	// 		}
	// 		else{
	// 			return res.send('404');
	// 		}
	// 	}
	// });

	let eqs=[{$eq: [ '$categoryId', '$$indicator_id' ] }];

	// let eqs=new Object();
	if(query.minPrice!=null&&query.maxPrice!=null){

		// eqs.price = { '$gte': parseInt(query.minPrice), '$lte': parseInt(maxPrice) };

		// console.log(eqs);
		// return res.send('200');

		eqs.push({$gte:['$price',parseInt(query.minPrice)]});
		eqs.push({$lte:['$price',parseInt(query.maxPrice)]});
	}
	if(query.discount!=null){
		// eqs.discount=parseInt(query.discount);
		eqs.push({$gte:['$discount',parseInt(query.discount)]});
	}
	// if(query.brand!=null){
		// eqs.push({$eq: [ '$categoryId', '$$indicator_id' ] });
	// }
	if(query.brand!=null){
	// 	let brandId= brandModel.findOne({name:query.brand},function(err,brand){
	// 		if(err||brand==null){
	// 			console.log(err);
	// 			return res.send('503');
	// 		}
	// 		else{
	// 			// eqs.brandId=brand._id;
	// 			categoryModel.findOne({slug:category}).populate({path:'products',match:{brandId:brand._id},options:{limit:9}}).exec(function(err,result){
	// 				if(err){
	// 					console.log(err);
	// 					return res.send('503');
	// 				}
	// 				else{
	// 					// console.log(result);
	// 					return res.render('./customer/product',{category:result,query:query});
	// 				}
	// 			})
	// 		}
	// 	})
	// }
	// else{
	// 	categoryModel.findOne({slug:category}).populate({path:'products',options:{limit:9}}).exec(function(err,result){
	// 		if(err){
	// 			console.log(err);
	// 			return res.send('503');
	// 		}
	// 		else{
	// 			return res.render('./customer/product',{category:result,query:query});
	// 		}
	// 	})
	// }

		categoryModel.aggregate([{
			$match: {
				slug: category,
			}
		},
		{
			$sort: {
				created: 1,
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
						$expr: {
							$and:eqs
						}
					}
				},
				{
					$lookup:{
						localField: "brandId",
						from:"brands",
						foreignField: "_id",
						as:"brands",
					}
				},
				]
			}
		},
		{
			$lookup: {
				localField: "_id",
				from: "brands",
				foreignField: "categoryId",
				as: "brands"
			}
		},

		]).exec(function(err, result){
			if(err){
				return res.send('503');
			}
			else{
			// res.send('Ok');
			return res.render('./customer/product',{category:result[0],query:query});
		}
	})
	}
else{
	categoryModel.aggregate([{
		$match: {
			slug: category,
		}
	},
	{
		$sort: {
			created: 1,
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
					$expr: {
						$and:eqs
					}
				}
			},
			]
		}
	},
	{
		$lookup: {
			localField: "_id",
			from: "brands",
			foreignField: "categoryId",
			as: "brands"
		}
	},

	]).exec(function(err, result){
		if(err){
			return res.send('503');
		}
		else{
			// console.log(result[0].products);
			return res.render('./customer/product',{category:result[0],query:query});
		}
	})
}
}