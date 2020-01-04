var express = require('express');
const userModel = require('../../models/user');

exports.listUser = async function(req,res,next){
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
		{username:{ '$regex' : query.q ,'$options': 'i'}},
		{phone:{ '$regex' : query.q ,'$options': 'i'}},
		{address:{ '$regex' : query.q ,'$options': 'i'}},
		{email:{ '$regex' : query.q ,'$options': 'i'}},
		{fullname:{ '$regex' : query.q ,'$options': 'i'}}
		];
	}
	if(query.status!=null){
		url=url+'&status='+query.status;
		findObj.status = query.status;
	}
	if(query.block){
		url=url+'&block='+query.block;
		findObj.block = query.block;
	}
	let sort={created:-1};
	if(query.sort!=null){
		url=url+'&sort='+query.sort;
		if(query.sort=='name'){
			sort={fullname:1};
		}
		else if(query.sort=='username'){
			sort={username:1};
		}
		else if(query.sort=='address'){
			sort={address:1};
		}
		else if(query.sort=='phone'){
			sort={phone:1};
		}
		else if(query.sort=='email'){
			sort={email:1};
		}
		else if(query.sort=='address'){
			sort={address:-1};
		}
		else if(query.sort=='status'){
			sort={block:-1};
		}
		else{
			sort={created:-1};
		}
	}
	let rsCount = await userModel.countUser(findObj);
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
		let rsList = await userModel.listUser(findObj,page,pageSize,sort);
		if(rsList.error){
			return res.send({error:true,messsage:'server error'});
		}
		else{
			let pagination={totalPage:parseInt(count/pageSize)+1,curPage:page,totalItem:count,url:url};
			return res.render('./admin/user-list',{users:rsList.data,pagination:pagination,query:query});
		}
	}
}

exports.blockUser =async function(req,res,next){

}

exports.userOrderHistory = async function(req,res,next){

}

exports.changeUserStatus = async function(req,res,next){
	let status = req.body.status;
	let id = req.body.id;
	if(status==null||id==null){
		return res.send({error:true,messsage:'invalid params'});
	}

	let result = await userModel.findById(id);
	result.block = status; // true: block, false: active
	result.save();
	if(result.error){
		return res.send({error:true,messsage:'server error'});
	}
	return res.send({error:false, messsage:'successfull'});

}

exports.deleteUser = async function(req,res,next){
	let id = req.body.id;
	if(id==null){
		return res.send({error:true,messsage:'invalid params'});
	}

	let result = await userModel.findByIdAndRemove(id);
	if(result.error){
		return res.send({error:true,messsage:'server error'});
	}
	return res.send({error:false, messsage:'successfull'});

}