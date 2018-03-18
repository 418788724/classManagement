var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');//首页
var notice = require('./routes/notice');//公告
var member = require('./routes/member');//成员
var chatroom = require('./routes/chatroom');//聊天室
var space = require('./routes/space');//空间
var task = require('./routes/task');//作业
var login = require('./routes/login');//登录
var logout = require('./routes/logout');//登出
var mange = require('./routes/mange');//管理
var users = require('./routes/users');//用户管理页
var test = require('./routes/test');


var settings = require('./settings');
var flash    = require('connect-flash');
//把会话信息存储于数据库中
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//session中间件持久化
app.use(session({
  secret: settings.cookieSecret,//防止篡改cookie:"momo"
  key: settings.db,//name:'class'
  cookie: {maxAge:1000 * 60 * 60 * 24 *30},
  store: new MongoStore({//会话信息存储到数据库中,实例化
    url:'mongodb://'+settings.host+':'+settings.port+'/'+settings.db
  }),
  resave:false,//是否允许session重新设置，要保证session有操作的时候必须设置这个属性为true
  saveUninitialized:true//:是否设置session在存储容器中可以给修改
}));
//flash结合重定向的功能，确保信息是提供给下一个被渲染的页面。
app.use(flash());

app.use('/', index);
app.use('/notice', notice);
app.use('/member', member);
app.use('/chatroom', chatroom);
app.use('/space', space);
app.use('/task', task);
app.use('/login', login);
app.use('/logout', logout);
app.use('/mange', mange);
app.use('/users', users);
app.use('/test', test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  // next(err);
  res.render("./error");
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
