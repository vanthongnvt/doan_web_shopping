var express = require('express');
var router = express.Router();
var passport =require('passport');

exports.dashboard = function(req, res, next) {
	res.render('./admin/index');
};

exports.loginPage = function(req,res,next){
	let loginError = req.flash('error')[0];
	res.render('./admin/login',{loginError:loginError});
};

exports.login = function(req,res,next){
	passport.authenticate('login', function(error, user, info) {
		if(error) {
			req.flash('error','Lỗi');
			return res.redirect('/admin/login');
		}
		if(!user||user.isAdmin==false) {
			req.flash('error','Tên tài khoản hoặc mật khẩu không chính xác');
			return res.redirect('/admin/login');
		}
		req.login(user, function(err) {
			if (err) {
				req.flash('error','Lỗi');
				return res.redirect('/admin/login');
			} else {
				return res.redirect('/admin');
			}
		});
	})(req, res, next);
};

exports.logOut = function(req,res,next){
	req.logOut();
	return res.redirect('/admin/login');
};