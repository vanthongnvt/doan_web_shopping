const categoryModel = require('../models/category');
module.exports = async function(req,res,next){
	let menu = await categoryModel.all();
	if(menu.error){
		return res.send({error:'Server error'});
	}
	res.locals.menu = menu.data;
	next();
}