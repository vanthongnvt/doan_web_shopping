var express = require('express');
var passport =require('passport');
var userModel= require('../../models/user');
var resetPasswordModel = require('../../models/resetPassword');
var commentModel = require('../../models/comment');
var orderModel = require('../../models/order');
var Cart =  require('../../models/cart');

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

exports.editInfo= function(req,res,next){

    res.render('./customer/edit_account');
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

exports.changePassword = function(req,res,next){
    res.render('./customer/change_password');
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