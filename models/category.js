var mongoose = require('mongoose');

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


categorySchema.set('toObject', { virtuals: true });
// categorySchema.set('toJSON', { virtuals: true });
var Category = mongoose.model('Category', categorySchema);

module.exports = Category;