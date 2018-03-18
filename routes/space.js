var express = require('express');
var router = express.Router();
var checkLogin = require('../middle/checkUser').checkLogin; //登录检查
var multer = require('../middle/multerAvatar'); //文件上传中间件
var uploadAvatar = multer.single('fileavatar'); //上传单个头像

var crypto = require('crypto');//加密
var User = require('../models/user');


/* GET home page. */
router.all(checkLogin).get('/', function(req, res, next) {
    res.render('space/space', {
      title: '个人空间',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});

/**
 * 修改个人信息
 */
router.route('/edit').get(function(req, res){
  res.render('space/edit', {
      title: '个人信息修改',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
  });
  //console.log(req.session.user);
}).post(function(req, res){
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      md5password = md5.update(req.body.password).digest('hex');
  var userObj = {
    _id: req.session.user._id
  };
  var updatestr ={
    password: md5password,
    number: req.body.number,
    email: req.body.email
  };
  if(req.body.password != req.body.reppassword){
    res.flash('error','密码不一致！');
    return res.redirect('/space/edit');
  }
  User.update(userObj, updatestr, function(err, doc){
    if(err){
      console.log('错误：'+err);
      res.flash('error','修改错误');
      res.redirect('/space/edit');
    }
    console.log(doc);
  });
  req.session.user.password = md5password;
  req.session.user.number = updatestr.number;
  req.session.user.email = updatestr.email;
  res.redirect('/space');
});

/**
 * 上传头像
 */
router.post('/upavatar', function(req, res){
  uploadAvatar(req, res, function(err){
    if(err){
      return console.log(err);
    }
    //console.log(req.file.path.split('\\').slice(1).join('/'));
    var userObj = {
        _id: req.session.user._id
    };
    console.log(req.file.filename);
    var updatestr = {
       avatar: req.file.path.split('\\').slice(1).join('/')
    }
    console.log(updatestr.avatar);
    User.updateAvatar(userObj, updatestr, function(err, doc){
      if(err){
        console.log('上传头像失败！');
      }
      req.session.user.avatar = updatestr.avatar;
      //res.redirect('/space/edit');
      res.send({msg:"上传成功！"});
    });
  });
});

module.exports = router;
