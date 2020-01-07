var express = require('express');
var router = express.Router();
var passport = require('passport');
const productModel = require('../../models/product');
const orderModel = require('../../models/order')
const categoryModel = require('../../models/category');
exports.dashboard = async function (req, res, next) {
	//top 10 product:
	let page = 1, pageSize = 10, findObj = {};
	var sort = { numberOfProductSold: -1 };
	let topTenProductList = await productModel.listProduct(findObj, page, pageSize, sort);
	if (topTenProductList.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	var topTenProductLength = topTenProductList.data.length;
	//top 10 category:
	let result;
	try {
		result = await categoryModel.aggregate([
			{
				"$lookup": {
					"from": "products",
					"localField": "_id",
					"foreignField": "categoryId",
					"as": "mergeCatePro"
				}
			},
			{
				"$addFields": {
					"sumSold": {
						"$sum": "$mergeCatePro.numberOfProductSold"
					}
				}
			},
			{ "$sort": { "sumSold": -1 } },
			{ "$limit": 10 },
			{ "$project": { "mergeCatePro": 0 } }
	
		]);
	} catch (error) {
		console.log(error);
		return res.send({ error: true, messsage: 'server error' });
	}
		// console.log(result);
	// console.log('length: ' + result.length);
	var topTenCategoryLength = result.length;

	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0');
	var yyyy = today.getFullYear();
	today = mm + '/' + dd + '/' + yyyy;
	// console.log(today);

	// chart dayly:
	let orderByDayInMonth = await orderModel.orderDaysInMonth(mm);
	// console.log(orderByDayInMonth.data);

	// chart weekly:
	let orderByWeekInMonth = await orderModel.orderWeeksInMonth(mm);
	// console.log(orderByWeekInMonth.data);

	// chart month:
	let orderByMonthInYear = await orderModel.orderMonthsInYear(yyyy);
	//console.log(orderByMonthInYear.data);

	// chart quarter:
	let orderByQuaterInYear = await orderModel.orderQuatersInYear(yyyy);
	console.log(orderByQuaterInYear.data);

	// chart year:
	let orderByMonthInDecade = await orderModel.orderYearsInDecade(yyyy);
	//console.log(orderByMonthInDecade.data);

	return res.render('./admin/index', { topTenSoldProducts: topTenProductList.data, topTenSoldCategories: result, topTenCategoryLength: topTenCategoryLength, topTenProductLength: topTenProductLength, 
		dataRevenueByDay: orderByDayInMonth.data,  dataRevenueByWeek: orderByWeekInMonth.data, dataRevenueByMonth:orderByMonthInYear.data,
		dataRevenueByYear: orderByMonthInDecade.data, dataRevenueByQuarter: orderByQuaterInYear.data});
	

	

};

exports.loginPage = function (req, res, next) {
	let loginError = req.flash('error')[0];
	res.render('./admin/login', { loginError: loginError });
};

exports.login = function (req, res, next) {
	passport.authenticate('login', function (error, user, info) {
		if (error) {
			req.flash('error', 'Lỗi');
			return res.redirect('/admin/login');
		}
		if (!user || user.isAdmin == false) {
			console.log(user);
			req.flash('error', 'Tên tài khoản hoặc mật khẩu không chính xác');
			return res.redirect('/admin/login');
		}
		req.login(user, function (err) {
			if (err) {
				req.flash('error', 'Lỗi');
				return res.redirect('/admin/login');
			} else {
				return res.redirect('/admin');
			}
		});
	})(req, res, next);
};

exports.logOut = function (req, res, next) {
	req.logOut();
	return res.redirect('/admin/login');
};

exports.updatePasswordPage = function(req,res,next){
	let messages = req.flash('messages')[0]||{};
    let old = req.flash('old')[0]||{};
	return res.render('./admin/update-password',{messages:messages,old:old});
}

exports.updatePassword = async function(req,res,next){
	let messages = {};
	let old = req.body;
	let password = req.body.account_password;
	let new_password = req.body.new_password;
	let password_confirmation = req.body.new_password_confirmation;
	if(!req.user.validPassword(password)){
		messages.password = 'Mật khẩu cũ không chính xác';
	}
	if(!new_password || new_password.length<6){
		messages.new_password = 'Mật khẩu tối thiểu 6 ký tự';
	}
	if(new_password!=password_confirmation){
		messages.password_confirmation = 'Mật khẩu xác nhận không khớp';
	}
	if(messages && Object.keys(messages).length > 0){
		req.flash('old',old);
		req.flash('messages',messages);
		return res.redirect('/admin/update-password');
	}

	let result = await req.user.updatePassowrd(new_password);
	if(result.error){
		messages.server_error = 'Đã có lỗi xảy ra. Vui lòng thử lại sau';
		req.flash('messages',messages);
		req.flash('old',old);
		return res.redirect('/admin/update-password');
	}
	else{
		messages.change_successfully = 'Thay đổi mật khẩu thành công';
		req.flash('messages',messages);
		return res.redirect('/admin/profile');
	}
}