var express = require('express');
var router = express.Router();

var crypto = require('crypto');//加密
var User = require('../models/user');

var checkNotLogin = require('../middle/checkUser').checkNotLogin;

router.route('/').all(checkNotLogin).get(function (req, res) {
  res.render('login/login', {
    title: '登录',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
}).post(function (req, res) {
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      md5password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  User.findOne(req.body.username, function(err, user){
     if(!user){
       req.flash('error', '用户不存在！');
       console.log('用户不存在')
       return res.redirect('/login');
     }
     //检查密码是否一致
     if(user.password != md5password){
      req.flash('error', '密码错误！');
      console.log('密码错误');
      return res.redirect('/login');
     }
     //登录成功
     req.session.user = user;
     console.log(req.session.user);
     req.flash('success', '登录成功！');
     res.redirect('/');
  });
});

module.exports = router;