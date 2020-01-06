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

brandSchema.virtual('numProducts', {
	ref: 'Product',
	localField: '_id',
	foreignField: 'brandId',
	count:true,
});

brandSchema.statics.getBrandByName=async function(name){
	try{
		var result = await this.findOne({name:name});
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}
brandSchema.statics.getBrandsByCategory=async function(categoryId){
	try{
		var result = await this.find({categoryId:categoryId,status:true}).exec();
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

brandSchema.statics.countBrand = async function(findObj){
	try{
		let result = await this.countDocuments(findObj).exec();
		return {error:false,count:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

brandSchema.statics.listBrand = async function(findObj,page,pageSize,sort){
	try{
		let result = await this.find(findObj).skip((page-1)*pageSize).limit(pageSize).populate('numProducts').populate('categoryId').sort(sort).exec();
		return {error:false,data:result};

	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

brandSchema.statics.changeBrandStatus = async function(id, status){
	try{
		let result = await this.findOneAndUpdate({_id: id}, {status: status}).exec();
		return {error:false,data:result};

	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

brandSchema.statics.removeBrand = async function(id){
	try{
		let result = await this.findByIdAndRemove(id).exec();
		return {error:false,data:result};

	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

var Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;