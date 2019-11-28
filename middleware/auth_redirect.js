module.exports =  function (req, res, next) {
	if (req.isAuthenticated()) {
		next();
	}
	else{
		req.flash('req_login','true');
		res.redirect('/');
	}
}