const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcryptjs');
const UserModel = require('../models/user');

passport.use('login', new LocalStrategy({
	passReqToCallback : true
},
function(req, username, password, done) { 
    UserModel.findOne({ 'username' :  username }, 
    	function(err, user) {
            if (err)
               return done(err);
           if (!user){
               console.log('User Not Found with username '+username);
               return done(null, false,{'username':'Tên tài khoản không tồn tại'});                 
           }
           if (!user.validPassword(password)){
               // console.log('Invalid Password');
               return done(null, false,{'password':'Mật khẩu không chính xác'});
           }
        return done(null, user);
    }
    );
}));

passport.use('signup', new LocalStrategy({
    	passReqToCallback : true
    },
    function(req, username, password, done) {
      if(password.length<6){
        return done(null,false,{'password':'Mật khẩu phải có tối thiểu 6 ký tự'});
      }
    	findOrCreateUser = function(){
            UserModel.findOne({'username':username},function(err, user) {
                if (err){
                	console.log('Error in SignUp: '+err);
                	return done(err);
                }
                if (user) {
                	// console.log('User already exists');
                	return done(null, false, {'username':'Tên tài khoản đã được sử dụng'});
                } else {
                    var newUser = new UserModel();
                    newUser.username = username;
                    newUser.password = newUser.encryptPassword(password);
                    newUser.email = req.body.email;
                    // newUser.firstName = req.params('firstName');
                    // newUser.lastName = req.params('lastName');

                    newUser.save(function(err) {
                  	    if (err){
                  		    console.log('Error in Saving user: '+err);  
                  		    throw err;  
                  	    }
                        // console.log('User Registration succesful');    
                        return done(null, newUser);
                    });
                }
            });
        }

        // Delay the execution of findOrCreateUser and execute 
        // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);

}));
passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	UserModel.findById(id, function(err, user) {
		done(err, user);
	});
});