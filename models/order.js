var mongoose = require('mongoose');
var productModel = require('../models/product');
var Schema = mongoose.Schema;
var orderSchema = mongoose.Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	name: {
		type: String,
		require: true
	},
	address: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true,
	},
	products: [{
		productId: {
			type: Schema.Types.ObjectId,
			ref: 'Product'
		},
		discount: Number,
		quantity: Number,
		price: Number,
	}],
	coupon: {
		type: Number,
		default: 0,
	},
	totalPrice: {
		type: Number,
		required: true
	},
	customer_note: {
		type: String
	},
	status: {
		type: Number,
		required: true,
		default: 0
	},
	status_note: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	checked: {
		type: Boolean,
		default: false
	}
}, { collection: 'orders' });

orderSchema.statics.createOrder = async function (cart, userId, name, address, phone, note) {
	let order = {};
	order.userId = userId;
	order.name = name;
	order.address = address;
	order.phone = phone;
	order.note = note;
	order.totalPrice = cart.totalPrice;
	order.products = [];
	// const session = await this.startSession();
	// session.startTransaction();
	// const opts = { session };
	for (id in cart.items) {
		try {
			let itemProduct = cart.items[id].item;
			let qty = cart.items[id].qty;
			let result = await productModel.findOneAndUpdate({ _id: id, status: true, quantity: { "$gte": qty } }, { "$inc": { "quantity": -qty, 'numberOfProductSold': qty } });
			if (!result) {
				// await session.abortTransaction();
				// session.endSession();
				return { error: true, message: 'product is not available', code: 1, name: itemProduct.name, link: itemProduct.link };
			}
			else {
				order.products.push({ productId: id, quantity: qty, discount: itemProduct.discount, price: itemProduct.price });
			}
		} catch (err) {
			console.log(err);
			// await session.abortTransaction();
			// session.endSession();
			return { error: true, message: 'server error', code: 0 };
		}
	}
	try {
		let result = await this.create(order);
		// await session.commitTransaction();
		// session.endSession();
		return { error: false, data: result };
	} catch (err) {
		console.log(err);
		// await session.abortTransaction();
		// session.endSession();
		return { error: true, message: 'server error', code: 0 };
	}

}

orderSchema.statics.getCountOrdersOfUser = async function (userId) {
	try {
		let result = await this.countDocuments({ userId: userId }).exec();
		return { error: false, count: result };
	} catch (err) {
		console.log(err);
		return { error: true, message: err };
	}
}

orderSchema.statics.getOrdersOfUser = async function (userId, page, pageSize) {
	try {
		let result = await this.find({ userId: userId }).skip((page - 1) * pageSize).limit(pageSize).sort({ created: -1 }).exec();
		return { error: false, data: result };
	} catch (err) {
		console.log(err);
		return { error: true, message: err };
	}
}

orderSchema.statics.getOrderById = async function (id) {
	try {
		let result = await this.findOne({ _id: id }).populate('userId').populate({ path: 'products.productId', populate: { path: 'categoryId' } }).exec();
		return { error: false, data: result };
	} catch (err) {
		console.log(err);
		return { error: true, message: err };
	}
}

orderSchema.statics.countOrder = async function (findObj) {
	try {
		let result = await this.countDocuments(findObj).exec();
		return { error: false, count: result };
	} catch (err) {
		console.log(err);
		return { error: true, message: err };
	}
}

orderSchema.statics.listOrder = async function (findObj, page, pageSize, sort) {
	try {
		let result = await this.find(findObj).skip((page - 1) * pageSize).limit(pageSize).sort(sort).exec();
		return { error: false, data: result };

	} catch (err) {
		console.log(err);
		return { error: true, message: err };
	}
}

orderSchema.statics.updateStatus = async function (id, status) {
	try {
		let order = await this.findOneAndUpdate({ _id: id }, { status: status }, { new: true }).exec();
		return { error: false, data: order };
	} catch (err) {
		console.log(err);
		return { error: true, message: err };
	}
}

orderSchema.statics.findAndMarkOrderById = async function (id) {
	try {
		let order = await this.findOneAndUpdate({ _id: id }, { checked: true }).exec();
		return { error: false, data: order };
	} catch (err) {
		console.log(err);
		return { error: true, message: err };
	}
}

orderSchema.statics.findAndRemoveOrderById = async function (id) {
	try {
		let order = await this.findByIdAndRemove(id);
		return { error: false, data: order };
	} catch (err) {
		console.log(err);
		return { error: true, message: err };
	}
}

orderSchema.statics.orderDaysInMonth = async function (inputMonth) {
	try {
		let result = await this.aggregate([
			{ $addFields: { "monthCreated": { $month: '$created' }, "dayCreated": { $dayOfMonth: '$created' } } },
			{ $match: { monthCreated: parseInt(inputMonth), status: 1 } },
			{$group: { 
				_id: "$dayCreated", 
				totalSold: { 
					$sum: "$totalPrice" 
				} 
			} }
		]);
		return { error: false, data: result };
	} catch (error) {
		console.log(error);
		return { error: true, message: err };
	}
	
}

orderSchema.statics.orderWeeksInMonth = async function (inputMonth) {
	try {
		let result = await this.aggregate([
			{ $addFields: { "monthCreated": { $month: '$created' }, "weekCreated": { $week: '$created' } } },
			{ $match: { monthCreated: parseInt(inputMonth), status: 1 } },
			{$group: { 
				_id: "$weekCreated", 
				totalSold: { 
					$sum: "$totalPrice" 
				} 
			} }
		]);
		return { error: false, data: result };
	} catch (error) {
		console.log(error);
		return { error: true, message: err };
	}
	
}

orderSchema.statics.orderMonthsInYear = async function (inputYear) {
	try {
		let result = await this.aggregate([
			{ $addFields: { "yearCreated": { $year: '$created' }, "monthCreated": { $month: '$created' } } },
			{ $match: { yearCreated: parseInt(inputYear), status: 1 } },
			{$group: { 
				_id: "$monthCreated", 
				totalSold: { 
					$sum: "$totalPrice" 
				} 
			} }
		]);
		return { error: false, data: result };
	} catch (error) {
		console.log(error);
		return { error: true, message: err };
	}
	
}

orderSchema.statics.orderQuatersInYear = async function (inputYear) {
	try {
		let result = await this.aggregate([
			{ $addFields: { 
				"yearCreated":{ $year: '$created' },
				"quarterCreated":{$cond:[{$lte:[{$month:"$created"},3]},
							1, // quy 1
							{$cond:[{$lte:[{$month:"$created"},6]},
							2,
							{$cond:[{$lte:[{$month:"$created"},9]},
							3,
							4]}]}]},
			 }},
			{ $match: { yearCreated: parseInt(inputYear), status: 1 } },
			{$group: { 
				_id: "$quarterCreated", 
				totalSold: { 
					$sum: "$totalPrice"
				} 
			} }
		]);
		return { error: false, data: result };
	} catch (error) {
		console.log(error);
		return { error: true, message: err };
	}
	
}

orderSchema.statics.orderYearsInDecade = async function (inputYear) {
	try {
		let result = await this.aggregate([
			{ $addFields: { "decadeCreated": parseInt(inputYear)/10, "yearCreated": { $year: '$created' } } },
			{ $match: { decadeCreated: parseInt(inputYear)/10, status: 1 } },
			{$group: { 
				_id: "$yearCreated", 
				totalSold: { 
					$sum: "$totalPrice" 
				} 
			} }
		]);
		return { error: false, data: result };
	} catch (error) {
		console.log(error);
		return { error: true, message: err };
	}
	
}


	var Order = mongoose.model('Order', orderSchema);

	module.exports = Order;