var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
	}
},{collection:'users'});

userSchema.virtual('reset_password', {
	ref: 'ResetPassword',
	localField: '_id',
	foreignField: 'userId',
});

userSchema.methods.encryptPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}
userSchema.statics.getUserByEmail = async function(email){
	try{
		var result = await this.findOne({email:email}).populate('reset_password').exec();
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

var User = mongoose.model('User', userSchema);

module.exports = User;