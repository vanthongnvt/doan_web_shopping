var Cart =  require('../models/cart');
module.exports =  function (req, res, next) {
	if (req.isAuthenticated()) {
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
	// console.log(req.session.cart);
	return next();
}