var express = require('express');
var productModel= require('../../models/product');
exports.detail = async function(req,res,next){
	let product=req.params.product;
	let category=req.params.category;
	let result = await productModel.getProductByName(product);
	if(!result.error){
		if(result.data!=null&&result.data.categoryId.slug==category){
			if(result.data.status==true||(req.isAuthenticated()&&req.user.isAdmin)){
				let relateProduct = await productModel.getRelateProducts(result.data);
				if(!relateProduct.error){
					res.render('./customer/single',{product:result.data, relateProducts:relateProduct.data});
				}
				else{
					return res.send('500');
				}
			}
			else{
				return res.render('./admin/404');
			}
		}
		return res.render('./admin/404');
	}
	else{
		return res.send('500');
	}
}
