module.exports =  function (req, res, next) {

	if(req.path=="login"||req.path=="logout"){
		return next();
	}
	if (!req.isAuthenticated()||!req.user.isAdmin==true) {
		if(req.xhr){
			return res.send({error:true,message:'unAuthenticated'});
		}
		else{
			res.render('./admin/404');
		}
	}
	else{
		next();
	}
}