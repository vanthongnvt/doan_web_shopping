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
	eqs.status = {'$eq':true};
	let page;
	if(query.page!=null){
		page=parseInt(query.page)>=0?parseInt(query.page):1;
		delete query.page;
	}
	else{
		page=1;
	}
	if(query.q!=null){
		url=url+'&q='+query.q;
		eqs.name = { '$regex' : query.q ,'$options': 'i'};
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
		let brand= await brandModel.getBrandByName(query.brand);
		if(!brand.error&&brand.data!=null){
			eqs.brandId=brand.data._id;
			url=url+'&brand='+query.brand+'&page=';
			let products= await categoryModel.paginateFilterProducts(category,sort,eqs,page);
			if(!products.err){
				if(products.data==null){
					return res.send('404');
				}
				count=products.total;
				let pagination={totalPage:parseInt(count/9)+1,curPage:page,totalItem:count,url:url};
				return res.render('./customer/product',{category:products.data,query:query,count:count,pagination:pagination});
			}
			return res.send('500');
		}
		return res.send('404');
	}
	else{
		if(Object.keys(query).length>0){
			url=url+'&page=';
		}
		else{
			url=url+'page=';
		}
		let products= await categoryModel.paginateFilterProducts(category,sort,eqs,page);
		if(!products.err){
			if(products.data==null){
				return res.send('404');
			}
			count=products.total;
			let pagination={totalPage:parseInt(count/9)+1,curPage:page,totalItem:count,url:url};
			return res.render('./customer/product',{category:products.data,query:query,count:count,pagination:pagination});
		}
		return res.send('500');
	}
}