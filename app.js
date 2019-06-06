//Npms
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var hbs = require('hbs');
var expressHbs = require('express-handlebars');
var createError = require('http-errors');
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); //data store to store the sessions
var flash = require('express-flash'); //attach messages for errors or successes
var passport = require('passport');
var cookieParser = require('cookie-parser'); //passport needs this
var passportSocketIo = require('passport.socketio');

var config = require('./config/secret'); //database link & connection
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sessionStore = new MongoStore({ url: config.database, autoReconnect: true});

var app = express();
var http = require('http').createServer(app); // create http server, needs this for socket.io
var io = require('socket.io')(http);

require('./realtime/io')(io); //not in a var cause we use the entire file
//Mongoose connection
mongoose.connect(config.database, function(err) {
  if (err) console.log(err);
  console.log("connected to the database");
})

//HandleBars config
var expressHbs = require('express-handlebars').create({
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  defaultLayout: 'layout',
  extname: 'hbs'
});
app.engine('hbs', expressHbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret,
  store: sessionStore
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//make user accessible evrywhere in the hbs files
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
})

//teaching socket.io and authorize io to use passport
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: 'connect.sid',
  secret: config.secret,
  store: sessionStore,
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail
}));

//function for success
function onAuthorizeSuccess(data, accept){
  console.log("successful connection");
  accept();
}
//function for fail
function onAuthorizeFail(data, message, error, accept){
  console.log("failed connection");
  if (error) accept(new Error(message));
}

//Routes
app.use('/', indexRouter);
app.use(usersRouter);

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

//Listen on port 3000
http.listen(3000, (err) => {
  if (err) console.log(err);
  console.log(`Running on port ${3000}`);
});

module.exports = app;
