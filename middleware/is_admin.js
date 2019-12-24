module.exports =  function (req, res, next) {
	return next();

	if(req.path=="login"||req.path=="logout"){
		return next();
	}
	if (req.isAuthenticated()&&req.user.isAdmin==true) {
		if(req.xhr){
			return res.send({error:true,message:'unAuthenticated'});
		}
		else{
			next();
		}
	}
	else{
		res.render('./admin/404');
	}
}