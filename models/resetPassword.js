var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var resetPassowrdSchema = mongoose.Schema({
	userId:{
		type:Schema.Types.ObjectId,
		required:true,
		ref: 'User'
	},
	token:{
		type:String,
		required:true,
	},
	expired:{
		type:Number,
		default:1800,
	},
	created: { 
		type: Date,
		default: Date.now
	}
},{collection:'reset_password'});

resetPassowrdSchema.methods.createToken = function(){
	var buf = new Buffer(16);
    for (var i = 0; i < buf.length; i++) {
        buf[i] = Math.floor(Math.random() * 256);
    }
    var token = buf.toString('base64');
    return token;
}

var ResetPassowrd = mongoose.model('ResetPassowrd', resetPassowrdSchema);

module.exports = ResetPassowrd;