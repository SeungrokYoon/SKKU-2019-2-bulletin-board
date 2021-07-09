var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login'); 
var boardRouter = require('./routes/board');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave:false,
  saveUninitialized:false,
  secret:'my_session_key' // 이렇게 세션을 require 후 use로 등록해줘야 세션을 사용 가능함.  커스텀 모듈
}),function(req,res,next){
  if(req.session.logined){
    res.locals.user_name = req.session.user_name;//모든 페이지에 다 넣어주겠다는 이야기 
  }
  next();
});
app.use('/', indexRouter);
app.use('/users', function(req,res,next){
  if(req.session.logined){ //로그인안되면 절대로 이 단계를 뛰어넘을 수가 없음. req.session.logined가 true가 되어야 하기 때문. 
    next();
  }else{
    res.redirect('/');
  }
},usersRouter);
app.use('/login', loginRouter);
app.use('/board', function(req,res,next){
  if(req.session.logined){ //로그인안되면 절대로 이 단계를 뛰어넘을 수가 없음. req.session.logined가 true가 되어야 하기 때문. 
    next();
  }else{
    res.redirect('/');
  }
},boardRouter);

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
  // res.render('error');
  res.send(err.message);
});

module.exports = app;
