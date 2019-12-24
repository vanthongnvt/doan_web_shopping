var express = require('express');
const orderModel= require('../../models/order');

exports.listOrder = async function(req,res,next){
	let page =1,pageSize =10,findObj = {};
	let url = req.baseUrl + req.path+'?page=';
	let query=req.query;
	if(query.page){
		page = parseInt(req.query.page);
		delete query.page;
	}
	if(query.q!=null){
		url=url+'&q='+query.q;
		findObj.$or = [
			{name:{ '$regex' : query.q ,'$options': 'i'}},
			{phone:{ '$regex' : query.q ,'$options': 'i'}},
			{address:{ '$regex' : query.q ,'$options': 'i'}}
		];
	}
	if(query.status!=null){
		url=url+'&status='+query.status;
		findObj.status = query.status;
	}
	if(query.checked){
		url=url+'&checked='+query.checked;
		findObj.checked = query.checked;
	}
	let sort={created:-1};
	if(query.sort!=null){
		url=url+'&sort='+query.sort;
		if(query.sort=='name'){
			sort={name:1};
		}
		else if(query.sort=='address'){
			sort={address:1};
		}
		else if(query.sort=='phone'){
			sort={phone:1};
		}
		else if(query.sort=='price'){
			sort={totalPrice:-1};
		}
		else if(query.sort=='status'){
			sort={status:-1};
		}
		else if(query.sort=='checked'){
			sort={checked:-1};
		}
		else{
			sort={created:-1};
		}
	}
	let rsCount = await orderModel.countOrder(findObj);
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
		let rsList = await orderModel.listOrder(findObj,page,pageSize,sort);
		if(rsList.error){
			return res.send({error:true,messsage:'server error'});
		}
		else{
			let pagination={totalPage:parseInt(count/pageSize)+1,curPage:page,totalItem:count,url:url};
			return res.render('./admin/order-list',{orders:rsList.data,pagination:pagination,query:query});
		}
	}
}

exports.changeOrderStatus = async function(req,res,next){

}

exports.markAsSeen = async function(req,res,next){

}

exports.orderDetail = async function(req,res,next){

}