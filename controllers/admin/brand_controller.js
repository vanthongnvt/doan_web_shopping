const express = require('express');
const brandModel= require('../../models/brand');
const categoryModel = require('../../models/category');

exports.listBrand = async function(req,res,next){
	
	let page =1,pageSize =10,findObj = {};
	let categoryList = await categoryModel.all();
	if(categoryList.error){
		return res.render('./admin/404');
	}
	else{
		categoryList = categoryList.data;
	}
	let url = req.baseUrl + req.path+'?page=';
	let query = req.query;
	if(query.page){
		page = parseInt(req.query.page);
		delete query.page;
	}
	if(query.q!=null){
		url=url+'&q='+query.q;
		findObj.name = { '$regex' : query.q ,'$options': 'i'};
	}
	if(query.categoryId){
		url=url+'&categoryId='+query.categoryId;
		findObj.categoryId = query.categoryId;
	}
	let sort={created:-1};
	if(query.sort!=null){
		url=url+'&sort='+query.sort;
		if(query.sort=='name'){
			sort={slug:1};
		}
		else if(query.sort=='product'){
			sort = {numProducts:-1};
		}
		else if(query.sort=='status'){
			sort={status:-1};
		}
		else{
			sort={created:-1};
		}
	}
	let rsCount = await brandModel.countBrand(findObj);
	if(rsCount.error){
		return res.send({error:true,messsage:'server error'});
	}
	else{
		if(Object.keys(query).length>0){
			url=url+'&page=';
		}
		else{
			url=url+'page=';
		}
		let count = rsCount.count;
		let rsList = await brandModel.listBrand(findObj,page,pageSize,sort);
		if(rsList.error){
			return res.send({error:true,messsage:'server error'});
		}
		else{
			let pagination={totalPage:parseInt(count/pageSize)+1,curPage:page,totalItem:count,url:url};
			return res.render('./admin/brand-list',{brands:rsList.data,categoryList:categoryList,pagination:pagination,query:query});
		}
	}

}

exports.addBrandPage = function(req,res,next){
	res.render('./admin/brand-add');
}

exports.createBrand = async function(req,res,next){

}

exports.editbrandPage = async function(req,res,next){

}

exports.updateBrand = async function(req,res,next){

}