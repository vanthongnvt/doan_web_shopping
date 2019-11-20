var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate-v2');
var categorySchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	slug:{
		type:String,
		required:true
	},
	status:{
		type: Boolean,
		required:true,
		default:true
	},
	isAccessories:{
		type: Boolean,
		required:true,
		default:false
	},
	created: { 
		type: Date,
		default: Date.now
	}
},{collection:'categories'});
categorySchema.virtual('products', {
	ref: 'Product',
	localField: '_id',
	foreignField: 'categoryId',
});

categorySchema.virtual('brands', {
	ref: 'Brand',
	localField: '_id',
	foreignField: 'categoryId',
});

categorySchema.virtual('numProducts', {
	ref: 'Product',
	localField: '_id',
	foreignField: 'categoryId',
	count:true,
});

// categorySchema.plugin(mongoosePaginate);

categorySchema.set('toObject', { virtuals: true });
// categorySchema.set('toJSON', { virtuals: true });
var Category = mongoose.model('Category', categorySchema);

module.exports = Category;