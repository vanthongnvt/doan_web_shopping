const express = require('express');
const productModel= require('../../models/product');
const categoryModel= require('../../models/category');
const brandModel=require('../../models/brand');

exports.listProduct = async function(req,res,next){
	let category = req.params.category;
	let query=req.query;
	let url = req.baseUrl+'?';
	// console.log(url);

	let eqs=new Object(),sort=new Object();
	let page;
	if(query.page!=null){
		page=query.page;
		delete query.page;
	}
	else{
		page=1;
	}
	if(query.minPrice!=null&&query.maxPrice!=null){
		url=url+'&minPrice='+query.minPrice+'&maxPrice='+query.maxPrice;
		if(parseInt(query.maxPrice)<=0){
			eqs.price = { '$gte': parseInt(query.minPrice)};
		}
		else{
			eqs.price = { '$gte': parseInt(query.minPrice), '$lte': parseInt(query.maxPrice) };
		}
	}
	if(query.discount!=null){
		url=url+'&discount='+query.discount;
		eqs.discount={'$gte':parseInt(query.discount)};
	}
	if(query.sort!=null){
		url=url+'&sort='+query.sort;
		if(query.sort=='new'){
			sort={created:-1};
		}
		else if(query.sort=='old'){
			sort={created:1};
		}
		else if(query.sort=='expensive'){
			sort={price:-1};
		}
		else if(query.sort=='cheap'){
			sort={price:1};
		}
		else if(query.sort=='discount'){
			sort={discount:-1};
		}
		else{
			sort={created:-1};
		}

	}
	if(query.brand!=null){
		let brandId= brandModel.findOne({name:query.brand},function(err,brand){
			if(err||brand==null){
				console.log(err);
				return res.send('503');
			}
			else{
				eqs.brandId=brand._id;
				url=url+'&brand='+query.brand+'&page=';

				categoryModel.findOne({slug:category}).populate({path:'numProducts',match:eqs}).exec(function(err,docs){
					if(err){
						console.log(err);
						return res.send('503');
					}
					else if(docs==null){
						return res.send('404');
					}
					else{
						let count=docs.numProducts;
						categoryModel.findOne({slug:category}).populate({path:'products',match:eqs,options:{skip:9*(page-1),limit:9,sort:sort}}).populate('brands').exec(function(err,result){

							if(err){
								console.log(err);
								return res.send('503');
							}
							else{
								let pagination={totalPage:parseInt(count/9)+1,curPage:page,totalItem:count,url:url};
								return res.render('./customer/product',{category:result,query:query,count:count,pagination:pagination});
							}
						})
					}
				});
			}
		})
	}
	else{
		if(query.length>0){
			url=url+'&page=';
		}
		else{
			url=url+'page=';
		}
		categoryModel.findOne({slug:category}).populate({path:'numProducts',match:eqs}).exec(function(err,docs){
			if(err){
				console.log(err);
				return res.send('503');
			}
			else if(docs==null){
				return res.send('404');
			}
			else{
				let count=docs.numProducts;
				categoryModel.findOne({slug:category}).populate({path:'products',match:eqs,options:{skip:9*(page-1),limit:9,sort:sort}}).populate('brands').exec(function(err,result){

					if(err){
						console.log(err);
						return res.send('503');
					}
					else{
						let pagination={totalPage:parseInt(count/9)+1,curPage:page,totalItem:count,url:url};
						// console.log(result);
						return res.render('./customer/product',{category:result,query:query,pagination:pagination});
					}
				})
			}
		});
	}
}