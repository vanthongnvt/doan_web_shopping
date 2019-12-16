var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	categoryId:{
		type:Schema.Types.ObjectId,
		required:true,
		ref: 'Category'
	},
	brandId:{
		type:Schema.Types.ObjectId,
		required:true,
		ref:'Brand'		
	},
	slug:{
		type:String,
		required:true
	},
	images:[{
		type:String,
		required:true,
	}],
	price:{
		type:Number,
		required:true,
		default:0
	},
	discount:{
		type:Number,
		default:0
	},
	detail:{
		type:String,
		required:true,
	},
	description:{
		type:String,
	},
	quantity:{
		type:Number,
		required:true,
		default:1
	},
	view:{
		type:Number,
		required:true,
		default:0
	},
	numberOfProductSold:{
		type:Number,
		required:true,
		default:0,
	},
	status:{
		type: Boolean,
		default:true,
		required:true
	},
	created: { 
		type: Date,
		default: Date.now
	}
},{collection:'products'});

productSchema.virtual('comments', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'productId',
	options: { sort: { created: -1 }}
});
productSchema.virtual('comments_count', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'productId',
	count:true
});
productSchema.methods.formatPrice=function(){
	return this.price.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

productSchema.statics.findProductById = async function(id){
	try{
		var result = await this.findOne({_id:id}).populate('categoryId').exec();
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

productSchema.statics.getProductByName=async function(name){
	try{
		var result = await this.findOne({slug:name}).populate('categoryId').populate('comments_count').exec();
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}
productSchema.statics.getRelateProducts = async function(product){
	try{
		var result = await this.find({categoryId:product.categoryId,_id:{$ne:product._id}}).limit(4).populate('categoryId').exec();
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

var Product = mongoose.model('Product', productSchema);

module.exports = Product;