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
});

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;