module.exports =  function (req, res, next) {
	if (req.isAuthenticated()) {
		res.locals.logged=true;
		res.locals.user=req.user;
	}
	else{
		res.locals.logged=false;
	}
	return next();
}