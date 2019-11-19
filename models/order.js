var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var orderSchema = mongoose.Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref:'User'
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
		}
		discount:Number,
		quantity:Number,
	}],
	pricing:{
		type:Number,
		required:true,
	},
	coupon:{
		type:Number,
		default:0,
	},
	totalCost:{
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
});

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;