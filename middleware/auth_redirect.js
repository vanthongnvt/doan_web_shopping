module.exports =  function (req, res, next) {
	if (req.isAuthenticated()) {
		if(req.xhr){
			return res.send({error:true,message:'unAuthenticated'});
		}
		else{
			next();
		}
	}
	else{
		req.flash('req_login','true');
		res.redirect('/');
	}
}