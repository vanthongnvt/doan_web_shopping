var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var brandSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	categoryId:{
		type:Schema.Types.ObjectId,
		required:true,
		ref:'Category'
	},
	slug:{
		type:String,
		required:true
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

var Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;