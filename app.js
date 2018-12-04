var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var passport = require('passport');
var FileStore = require('session-file-store')(session);
var passportConfig = require('./lib/passport-config');
var request = require('request');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var admin = require('./routes/admin');
var contestRouter = require('./routes/contest');
//var authRouter = require('./routes/auth')(app, passport);

//https://pacific-plateau-16529.herokuapp.com/ | https://git.heroku.com/pacific-plateau-16529.git

//Secret key :6LeFtn4UAAAAAHbEP248K1sNDemD4IYNp2by5aei
//Site key : 6LeFtn4UAAAAAFEC_faBmSs2xHjD_fQxN0uXlTXh


var app = express();

// Pug의 local에 moment라이브러리와 querystring 라이브러리를 사용할 수 있도록.
app.locals.moment = require('moment');
app.locals.querystring = require('querystring');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

app.use(express.static(path.join(__dirname, 'public')));



app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));




app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

//session
//var sessionStore = new session.MemoryStore;  소켓 할때 사용
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'long-long-long-secret-string-1313513tefgwdsvbjkvasd',
  store: FileStore(),  //sessionStore
}));

 //flash 사용  //router보다 더 높이 있어야함
 app.use(flash());



//passport
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

 // //사용자에게 flash 메세지를 전달
 app.use(function(req, res, next) {
  res.locals.currentUser = req.session.user;
  res.locals.flashMessages = req.flash();
  next();
});


app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
 })



// //mongodb 연결 
mongoose.Promise = global.Promise;
const uri = "mongodb+srv://chanhee:qwerty1202@cluster0-1ay2j.mongodb.net/test"
mongoose.connect(uri, { useCreateIndex: true, useNewUrlParser: true}, function(err, client){
  if(err){
    console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
  }
  console.log('Connected...');
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', admin);
//app.use('/auth', authRouter);
require('./routes/auth')(app, passport);
//require('./routes/admin')(app, passport);
app.use('/contest', contestRouter);
//require('./routes/contest')(app, passport);


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
