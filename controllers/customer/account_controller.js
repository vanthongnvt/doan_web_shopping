var express = require('express');
var passport =require('passport');
var userModel= require('../../models/user');

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

exports.ordersHistory = function(req,res,next){
    res.render('./customer/orders_history');
}

exports.changePassword = function(req,res,next){
    res.render('./customer/change_password');
}

exports.orderDetail = function(req,res,next){
    res.render('./customer/order_detail');
}