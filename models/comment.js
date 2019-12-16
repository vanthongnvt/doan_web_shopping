var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate-v2');
var commentSchema = mongoose.Schema({
	productId:{
		type:String,
		required:true
	},
	userId:{
		type:String,
	},
	name: {
		type: String,
		required: true
	},
	avatar:{
		type: String,
		default:null
	},
	content:{
		type:String,
		required:true
	},
	created: { 
		type: Date,
		default: Date.now
	}
},{collection:'comments'});

commentSchema.statics.getCommentsProduct = async function(productId,page){
	try{
		let result = await this.find({productId:productId}).skip(10*(page-1)).limit(10).sort({created:-1}).exec();
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true ,message:err.err};
	}
}

commentSchema.statics.getCountCommentsProduct = async function(productId){
	try{
		let result = await this.countDocuments({productId:productId}).exec();
		return {error:false,count:result};
	}catch(err){
		console.log(err);
		return {error:true ,message:err.err};
	}
}

commentSchema.statics.createComment = async function(commentObj){
	try{
		var result = await this.create(commentObj);
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
	
}

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;