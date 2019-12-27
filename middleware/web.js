var Cart =  require('../models/cart');
module.exports =  function (req, res, next) {
	if (req.isAuthenticated()) {
		// console.log(req.user);
		res.locals.logged=true;
		res.locals.user=req.user;
	}
	else{
		res.locals.logged=false;
	}
	if(typeof req.session.cart=='undefined'){
		let cart = new Cart({});
		req.session.cart = cart;
	}
	res.locals.session = req.session;
	res.locals.csrfToken=req.csrfToken();
	// console.log(req.session.cart);
	res.locals.getDateCreated = function(date_time){
		var dd = String(date_time.getDate()).padStart(2, '0');
		var mm = String(date_time.getMonth() + 1).padStart(2, '0');
		var yyyy = date_time.getFullYear();
		return dd + '/' + mm + '/' + yyyy;
	}
	res.locals.priceFormat = function(price){
		let res = Number((price).toFixed(1)).toLocaleString();
		return res;
	}
	return next();
}