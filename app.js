var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();
var db=mongoose.connect(process.env.DB_URL,{ useUnifiedTopology: true,useNewUrlParser: true,useCreateIndex: true }, function (err) {
	console.log(err);
});
var indexRouter = require('./routes/customer/index');
var accountRouter = require('./routes/customer/account');
var contactRouter=require('./routes/customer/contact');
var aboutRouter=require('./routes/customer/about');
var categoryRouter = require('./routes/customer/category');
var productRouter = require ('./routes/customer/product');
var checkoutRouter=require('./routes/customer/checkout');
var migrateRouter=require('./routes/customer/migratedb');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/migrate', migrateRouter);
app.use('/tai-khoan', accountRouter);
app.use('/thanh-toan',checkoutRouter);
app.use('/lien-he',contactRouter);
app.use('/gioi-thieu',aboutRouter);
// app.use('/san-pham',productRouter);
app.use('/:category',categoryRouter);
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
