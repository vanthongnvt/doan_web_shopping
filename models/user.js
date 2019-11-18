var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
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
	block:{
		type:Boolean,
		default:false
	},
	created: { 
		type: Date,
		default: Date.now
	}
});

var User = mongoose.model('User', userSchema);

module.exports = User;