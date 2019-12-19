var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var logger = require('morgan');
var mongoose = require('mongoose');
var expressSession = require('express-session');
var MongoStore =require('connect-mongo')(expressSession);
var bodyParser = require('body-parser');
var flash=require('connect-flash');
var validator = require('express-validator');
var passport = require('passport');
require('./middleware/init_passport');
require('dotenv').config();
var db=mongoose.connect(process.env.DB_URL,{ useUnifiedTopology: true,useNewUrlParser: true,useCreateIndex: true,useFindAndModify: false }, function (err) {
	if(err){
		console.log(err);
	}
});
var indexRouter = require('./routes/customer/index');
var accountRouter = require('./routes/customer/account');
var contactRouter=require('./routes/customer/contact');
var aboutRouter=require('./routes/customer/about');
var categoryRouter = require('./routes/customer/category');
var productRouter = require ('./routes/customer/product');
var checkoutRouter=require('./routes/customer/checkout');
var migrateRouter=require('./routes/customer/migratedb');
var cartRouter = require('./routes/customer/cart');
var commentRouter = require('./routes/customer/comment');

var indexAdminRouter = require('./routes/admin/index');
var categoryAdminRouter = require('./routes/admin/category');
var productAdminRouter = require('./routes/admin/product');
var userAdminRouter = require('./routes/admin/user');
var orderAdminRouter = require('./routes/admin/order');
var profileAdminRouter = require('./routes/admin/profile');

var csrfProtection = csrf({ cookie: true });
var webMiddleware=require('./middleware/web');
var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(expressSession({
  secret: process.env.APP_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection:mongoose.connection}),
  cookie:{maxAge: 180*60*1000}
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(validator());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')))

app.use(csrfProtection);
//middleware
app.use(webMiddleware);


//route
app.use('/', indexRouter);
app.use('/migrate', migrateRouter);
app.use('/tai-khoan', accountRouter);
app.use('/don-hang',checkoutRouter);
app.use('/lien-he',contactRouter);
app.use('/gioi-thieu',aboutRouter);
app.use('/cart',cartRouter);
app.use('/comment',commentRouter);
// app.use('/san-pham',productRouter);


app.use('/admin', indexAdminRouter);
app.use('/admin/gian-hang', categoryAdminRouter);
app.use('/admin/san-pham', productAdminRouter);
app.use('/admin/nguoi-dung', userAdminRouter);
app.use('/admin/don-hang', orderAdminRouter);
app.use('/admin/profile', profileAdminRouter);

app.use('/:category([-\\w]+)',categoryRouter);
app.use('/:category/:product',productRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
