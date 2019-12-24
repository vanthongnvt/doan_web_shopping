const express = require('express');
const categoryModel= require('../../models/category');

exports.listCategory = async function(req,res,next){
	
	let page =1,pageSize =10,findObj = {};
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
	if(query.isAccessories!=null){
		url=url+'&isAccessories='+query.isAccessories;
		findObj.isAccessories = query.isAccessories;
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
		else if(query.sort=='isAccessories'){
			sort = {isAccessories:-1};
		}
		else if(query.sort=='status'){
			sort={status:-1};
		}
		else{
			sort={created:-1};
		}
	}
	let rsCount = await categoryModel.countCategory(findObj);
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
		let rsList = await categoryModel.listCategory(findObj,page,pageSize,sort);
		if(rsList.error){
			return res.send({error:true,messsage:'server error'});
		}
		else{
			let pagination={totalPage:parseInt(count/pageSize)+1,curPage:page,totalItem:count,url:url};
			return res.render('./admin/category-list',{categories:rsList.data,pagination:pagination,query:query});
		}
	}

}

exports.addCategoryPage = function(req,res,next){
	res.render('./admin/category-add');
}

exports.createCategory = async function(req,res,next){

}

exports.editCategoryPage = async function(req,res,next){

}

exports.updateCategory = async function(req,res,next){

}