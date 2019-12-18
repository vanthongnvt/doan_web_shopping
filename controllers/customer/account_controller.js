var express = require('express');
var passport =require('passport');
var userModel= require('../../models/user');
var resetPasswordModel = require('../../models/resetPassword');
var commentModel = require('../../models/comment');
var orderModel = require('../../models/order');
var Cart =  require('../../models/cart');

exports.userInfo = function(req,res,next){
        orderModel.find({},function(err,docs){
            console.log(docs);
            console.log(docs[0].products);
        });
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

exports.editInfo= function(req,res,next){

    res.render('./customer/edit_account');
}

exports.ordersHistory = function(req,res,next){
    res.render('./customer/orders_history');
}

exports.changePassword = function(req,res,next){
    res.render('./customer/change_password');
}

exports.orderDetail = function(req,res,next){
    res.render('./customer/order_detail');
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
    let result = await orderModel.createOrder(cart,userId,address,phone,note);
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