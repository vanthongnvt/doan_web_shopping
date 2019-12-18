var mongoose = require('mongoose');
var productModel= require('../models/product');
var Schema = mongoose.Schema;
var orderSchema = mongoose.Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref:'User'
	},
	name : {
		type: String,
		require:true
	},
	address:{
		type:String,
		required:true
	},
	phone:{
		type:String,
		required:true,
	},
	products:[{
		productId:{
			type:Schema.Types.ObjectId,
			ref:'Product'
		},
		discount:Number,
		quantity:Number,
	}],
	coupon:{
		type:Number,
		default:0,
	},
	totalPrice:{
		type:Number,
		required:true
	},
	customer_note:{
		type:String
	},
	status:{
		type:Number,
		required:true,
		default:0
	},
	status_note:{
		type:String
	},
	created: { 
		type: Date,
		default: Date.now
	}
},{collection:'orders'});

orderSchema.statics.createOrder = async function(cart,userId,address,phone,note){
	let order = {};
	order.userId = userId;
	order.address = address;
	order.phone = phone;
	order.note = note;
	order.totalPrice = cart.totalPrice;
	order.products = [];
	for(id in cart.items){
		try{
			let qty = cart.items[id].qty;
			let result = await productModel.findOneAndUpdate({_id:id,status:true,quantity:{"$gte":qty}},{"$inc": { "quantity":-qty}});
			if(!result){
				return {error:true, message:'product is not available', code:1, name:cart.items[id].item.name, link: cart.items[id].item.link};
			}
			else{
				order.products.push({productId:id,quantity:cart.items[id].qty,discount:cart.items[id].item.discount});
			}
		}catch(err){
			console.log(err);
			return {error:true, message:'server error', code:0};
		}
	}
	try{
		let result = await this.create(order);
		return {error:false, data:result};
	}catch(err){
		console.log(err);
		return {error:true, message:'server error',code:0};
	}

}

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;