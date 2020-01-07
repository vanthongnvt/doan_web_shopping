var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 
var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	fullname: String,
	
	email: String,

	password:{
		type: String,
		required:true
	},
	phone:{
		type:String,
	},
	address:{
		type:String,
	},
	avatar: {
		type: String,
	},
	gender:{
		type: Number,
		default: 0,
	},
	isAdmin:{
		type: Boolean,
		default:false
	},
	block:{
		type:Boolean,
		default:false
	},
	created: { 
		type: Date,
		default: Date.now
	},
	resetPassword:{
		token:String,
		created_at:Date
	}
},{collection:'users'});

userSchema.methods.encryptPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}
userSchema.methods.updatePassowrd =async function(newPassword){
	try{
		let encryptPw =  bcrypt.hashSync(newPassword, bcrypt.genSaltSync(5), null);
		var result = await this.updateOne({password:encryptPw}).exec();
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

userSchema.methods.updateAvatar = async function(avatar){
	try{
		var result = await this.updateOne({avatar:avatar}).exec();
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

userSchema.statics.createToken = async function(userId){
	console.log(userId);
	let token = crypto.randomBytes(48).toString('hex');
	try{
		let resetPassword = {token:token,created_at:Date.now()};
		let result = await this.updateOne({_id:userId},{resetPassword:resetPassword}).exec();
		return {error:false,data:token};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
	return token;
}

userSchema.statics.findUserResetPassword = async function(token){
	try{
		var result = await this.findOne({'resetPassword.token':token}).exec();
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

userSchema.statics.getUserByEmail = async function(email){
	try{
		var result = await this.findOne({email:email}).exec();
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

userSchema.statics.countUser = async function(findObj){
	findObj.isAdmin = false;
	try{
		let result = await this.countDocuments(findObj).exec();
		return {error:false,count:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

userSchema.statics.listUser = async function(findObj,page,pageSize,sort){
	findObj.isAdmin = false;
	try{
		let result = await this.find(findObj).skip((page-1)*pageSize).limit(pageSize).sort(sort).exec();
		return {error:false,data:result};

	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

userSchema.statics.updateInfo = async function(id,fullname,email,phone,address,gender){
	try{
		let result = await this.updateOne({_id:id},{fullname:fullname,email:email,phone:phone,address:address,gender:gender}).exec();
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

userSchema.statics.updateUserStatus = async function(id, status){
	try{
		let result = await this.findOneAndUpdate({_id: id}, {block: status}).exec();
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

userSchema.statics.removeUser = async function(id){
	try{
		let result = await this.findByIdAndRemove(id).exec();
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

userSchema.statics.findUserById = async function(id){
	try{
		let result = await this.findById(id).exec();
		return {error:false,data:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

var User = mongoose.model('User', userSchema);

module.exports = User;