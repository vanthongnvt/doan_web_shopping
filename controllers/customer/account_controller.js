var express = require('express');
var passport =require('passport');
var userModel= require('../../models/user');
var resetPasswordModel = require('../../models/resetPassword');
var commentModel = require('../../models/comment');
var orderModel = require('../../models/order');
var Cart =  require('../../models/cart');
var fs = require('fs');

exports.userInfo = function(req,res,next){

    res.render('./customer/account');
}

exports.signup = function(req,res,next){
   passport.authenticate('signup', function(error, user, info) {
    if(error) {
        return res.status(500).json(error);
    }
    if(!user) {
        return res.status(401).json(info);
    }
    req.login(user, function(err) {
        if (err) {
            res.status(500).json(error);
        } else {
            res.json({success:true});
        }
    });
})(req, res, next);
}

exports.login = function(req,res,next){
    passport.authenticate('login', function(error, user, info) {
        if(error) {
            return res.status(500).json(error);
        }
        if(!user) {
            return res.status(401).json(info);
        }
        req.login(user, function(err) {
            if (err) {
                res.status(500).json(error);
            } else {
                res.json({success:true});
            }
        });
    })(req, res, next);
}

exports.logout= function(req,res,next){
	req.logOut();
    res.redirect('/');
}

exports.editInfoPage = function(req,res,next){

    let messages = req.flash('messages')[0]||{};
    let old = req.flash('old')[0]||{};
    res.render('./customer/edit_account',{messages:messages,old:old});
}

exports.updateInfo = async function(req,res,next){
    let messages = {};
    let old = req.body;
    let fullname =req.body.account_fullname?req.body.account_fullname:null;
    let email = req.body.account_email?req.body.account_email:null;
    let phone = req.body.account_phone?req.body.account_phone:null;
    let address = req.body.account_address?req.body.account_address:null;
    let userId = req.user._id;
    if(phone!=null){
        req.checkBody('account_phone','Số điện thoại không hợp lệ').isMobilePhone();
    }
    if(email!=null){
        req.checkBody('account_email','Email không hợp lệ').isEmail();
    }
    let validateErr = req.validationErrors();
    if(validateErr){
        console.log(validateErr);
        validateErr.forEach(function(error){
            let err_key = 'error_'+ error.param;
            messages[err_key] = error.msg;
        })
    }
    if(fullname!=null&&fullname.length > 50){
        messages.error_phone = 'Tên tối đa 50 ký tự';
    }

    if(address!=null&&address.length>300){
        messages.error_address = 'Địa chỉ tối đa 300 ký tự';
    }
    if(messages && Object.keys(messages).length > 0){
        req.flash('old',old);
        req.flash('messages',messages);
        return res.redirect('/tai-khoan/chinh-sua');
    }

    let result = await userModel.updateInfo(userId,fullname,email,phone,address);
    if(result.error){
        messages.server_error = 'Đã có lỗi xảy ra. Vui lòng thử lại sau';
        req.flash('messages',messages);
        return res.redirect('/tai-khoan/chinh-sua');
    }
    else{
        return res.redirect('/tai-khoan');
    }
}

exports.ordersHistory = async function(req,res,next){
    let userId = req.user._id;
    let page =1;
    let url = req.baseUrl + req.path +'?page=';
    if(req.query.page){
        page = parseInt(req.query.page);
    }
    let pageSize = 10;
    let rsCount = await orderModel.getCountOrdersOfUser(userId);
    if(rsCount.error){
        return res.send({error:true,messsage:'server error'});
    }
    else{
        let count = rsCount.count;
        let result = await orderModel.getOrdersOfUser(userId,page,pageSize);
        if(result.error){
            return res.send({error:true,messsage:'server error'});
        }
        else{
            let pagination={totalPage:parseInt(count/pageSize)+1,curPage:page,totalItem:count,url:url};
            res.render('./customer/orders_history',{orders:result.data,pagination:pagination});
        }
    }
}

exports.changePasswordPage = function(req,res,next){
    let messages = req.flash('messages')[0]||{};
    let old = req.flash('old')[0]||{};
    console.log(messages);
    res.render('./customer/change_password',{messages:messages,old:old});
}

exports.changePassword = async function(req,res,next){
    let messages = {};
    let old = req.body;
    let password = req.body.account_password;
    let new_password = req.body.new_password;
    let password_confirmation = req.body.new_password_confirmation;
    if(!req.user.validPassword(password)){
        messages.password = 'Mật khẩu cũ không chính xác';
    }
    if(new_password.length<6){
        messages.new_password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    if(new_password!=password_confirmation){
        messages.password_confirmation = 'Mật khẩu xác nhận không khớp';
    }
    if(messages && Object.keys(messages).length > 0){
        req.flash('old',old);
        req.flash('messages',messages);
        return res.redirect('/tai-khoan/thay-doi-mat-khau');
    }

    let result = await req.user.updatePassowrd(new_password);
    if(result.error){
        messages.server_error = 'Đã có lỗi xảy ra. Vui lòng thử lại sau';
        req.flash('messages',messages);
        req.flash('old',old);
        return res.redirect('/tai-khoan/thay-doi-mat-khau');
    }
    else{
        messages.change_successfully = 'Thay đổi mật khẩu thành công';
        req.flash('messages',messages);
        return res.redirect('/tai-khoan/thay-doi-mat-khau');
    }
}

exports.updateAvatar = async function(req,res,next){
    var fstream;
    if(req.busboy){
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            // console.log("Uploading: " + filename);

            fstream = fs.createWriteStream(process.cwd()+'/public/images/avatars/'+ req.user._id + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                // console.log("Upload Finished of " + filename);
                let result = req.user.updateAvatar(req.user._id+filename);
                if(result.error){
                    return res.send({error:true,messages:'Đã có lỗi xảy ra. Vui lòng thử lại sau'});
                }else{              
                    return res.send({error:false,messages:'successfully'});
                }
            });
        });
    }else{
        return res.send({error:true,messages:'Đã có lỗi xảy ra. Vui lòng thử lại sau'});
    }
}

exports.orderDetail = async function(req,res,next){
    let id = req.params.id;
    let result = await orderModel.getOrderById(id);
    if(result.error){
        return res.send({error:true,messsage:'server error'});
    }
    else{
        res.render('./customer/order_detail',{order:result.data});
    }
}

exports.forgotPassword = function(req,res,next){
    res.render('./customer/forgot_password');
}
exports.sendEmailResetPassword = async function(req,res,next){
    var user = userModel.getUserByEmail(); 
    // let resetPassword = new resetPasswordModel();
    // resetPassword. 

}

exports.resetPassword = function(req,res,next){
    res.render('./customer/reset_password');
}

exports.order = async function(req,res,next){
    let messages = {};
    let old = req.body;
    let userId = req.user._id;
    let address = req.body.address;
    let phone = req.body.phone;
    let name = req.body.name;
    if(!address){
        messages.error_address = 'Địa chỉ không được để trống';
    }
    if(!phone){
        messages.error_phone = 'Điện thoại không được để trống';
    }
    else{
        req.checkBody('phone','Số điện thoại không hợp lệ').isMobilePhone();
        let validateErr = req.validationErrors();
        if(validateErr){
            messages.error_phone = 'Số điện thoại không hợp lệ';
        }
    }
    if(!name){
        messages.error_name = 'Tên người nhận không được để trống';
    }
    if(messages && Object.keys(messages).length > 0){
        req.flash('old',old);
        req.flash('messages',messages);
        return res.redirect('/don-hang');
    }
    let note = req.body.note;
    let cart = new Cart(req.session.cart?req.session.cart:{});
    if(cart.totalItem <= 0){
        res.redirect('/don-hang');
    }
    let result = await orderModel.createOrder(cart,userId,name,address,phone,note);
    if(result.error){
        console.log('1');
        if(result.code == 1){
            messages.unavailable_products = 'Sản phẩm <a href="'+result.link+'">'+result.name+'</a> có thể đã hết hoặc không đủ số lượng';
            req.flash('messages',messages);
            req.flash('old',old);
            return res.redirect('/don-hang');
        }
        else{
            messages.server_error = 'Đã có lỗi xảy ra. Vui lòng thử lại sau';
            req.flash('old',old);
            req.flash('messages',messages);
            return res.redirect('/don-hang');
        }
    }
    else{
        messages.order_successfully = 'Đặt hàng thành công';
        req.flash('messages',messages);
        cart.clear();
        req.session.cart = cart;
        return res.redirect('/don-hang');
    }
}