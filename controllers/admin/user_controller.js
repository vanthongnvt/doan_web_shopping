var express = require('express');
const userModel = require('../../models/user');

exports.listUser = async function(req,res,next){
	let page =1,pageSize =10,findObj = {};
	let url = req.baseUrl + req.path+'?';
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
	if(status==null||id==null&&id!=req.user._id){
		return res.send({error:true,messsage:'invalid params'});
	}

	let result = await userModel.updateUserStatus(id, status);
	if(result.error){
		return res.send({error:true,messsage:'server error'});
	}
	return res.send({error:false, messsage:'successfull'});

}

exports.deleteUser = async function(req,res,next){
	let id = req.body.id;
	if(id==null&&id!=req.user._id){
		return res.send({error:true,messsage:'invalid params'});
	}

	let result = await userModel.removeUser(id);
	if(result.error){
		return res.send({error:true,messsage:'server error'});
	}
	return res.send({error:false, messsage:'successfull'});

}

exports.userInfoPage = async function(req,res,next){
	let id = req.params.id;
	var user = await userModel.findUserById(id);
	if(user.error){
		return res.send({error:true,messsage:'server error'});
	}
	console.log(user);
	return res.render('./admin/user-info', {user: user.data});
}

exports.profile = async function(req,res,next){
	let admin = req.user;
	console.log(admin);
	res.render('./admin/profile',{admin:admin});
}

exports.adminUpdateInfo = async function(req,res,next){
	let messages = [];
    let fullname =req.body.fullname?req.body.fullname:null;
    let email = req.body.email?req.body.email:null;
    let phone = req.body.phone?req.body.phone:null;
    let address = req.body.address?req.body.address:null;
    let userId = req.user._id;
    let gender = req.body.gender;
    if(gender){
    	gender = parseInt(gender);
    	if(gender!=0){
    		gender=1;
    	}
    }
    if(phone!=null){
        req.checkBody('phone','Số điện thoại không hợp lệ').isMobilePhone();
    }
    if(email!=null){
        req.checkBody('email','Email không hợp lệ').isEmail();
    }
    let validateErr = req.validationErrors();
    if(validateErr){
        validateErr.forEach(function(error){
            let err_key = 'error_'+ error.param;
            messages.push(error.msg);
        })
    }
    if(fullname!=null&&fullname.length > 50){
        messages.push('Họ tên tối đa 50 ký tự');
    }

    if(address!=null&&address.length>300){
        messages.push('Địa chỉ tối đa 300 ký tự');
    }
    if(messages && Object.keys(messages).length > 0){
        return res.send({error:true,messages:messages});
    }

    let result = await userModel.updateInfo(userId,fullname,email,phone,address,gender);
    if(result.error){
        messages.push('Đã có lỗi xảy ra. Vui lòng thử lại sau');
        return res.send({error:true,messages:messages});
    }
    else{
        return res.send({error:false});
    }
}