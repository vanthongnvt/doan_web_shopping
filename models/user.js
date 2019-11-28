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

userSchema.methods.encryptPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}

var User = mongoose.model('User', userSchema);

module.exports = User;