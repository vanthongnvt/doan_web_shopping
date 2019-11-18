var express = require('express');
var userModel= require('../../models/user');

exports.userInfo = function(req,res,next){
  	// res.render('./customer/product');
  	res.send('OK');
}