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
},{collection:'brands'});

brandSchema.statics.getBrandByName=async function(name){
	try{
		var result = await this.findOne({name:name});
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

var Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;