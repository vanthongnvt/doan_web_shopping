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
});

productSchema.methods.formatPrice=function(){
	return this.toFixed(0).price.replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

var Product = mongoose.model('Product', productSchema);

module.exports = Product;