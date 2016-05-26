var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express_session = require('express-session');//To store session.

var app = express();

/*
 * TO share session between Express and Primus
 */
var secret = "Best Game Develop Club in Universe";
var cookies = cookieParser(secret);
var store = new express_session.MemoryStore();

app.set('cookie_inst', cookies);
app.set('store_inst', store);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookies);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express_session({
	secret: secret,
	cookie: {maxAge:60 * 60 * 1000, httpOnly:true},//Cookie expires 60 minutes.(imported from tripmaster, so I don't know exact meaning.)
	saveUninitialized: true,
	resave: false,
	rolling: true,
  store: store
}));

//base---------------------------------
app.get('/*', function(req, res, next){
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); 
	next();
});

app.use('/', require('./routes/index'));
app.use('/signin', require('./routes/signin'));
app.use('/signup', require('./routes/signup'));
app.use('/signout', require('./routes/signout'));
app.use('/room', require('./routes/room'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
