var express = require('express');
var router = express.Router();

var crypto = require('crypto');//加密
var Admin = require('../models/admin');

router.route('/').get(function (req, res) {
  res.render('admin/admin', {
    title: '管理员登录',
    admin: req.session.admin,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
}).post(function (req, res) {
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      md5password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  Admin.find(req.body.username, function(err, admin){
     if(!admin){
       req.flash('error', '管理员不存在！');
       return res.redirect('/admin');
     }
     //检查密码是否一致
     if(admin.password != md5password){
      req.flash('error', '密码错误！');
      console.log('密码错误');
      return res.redirect('/admin');
     }
     //登录成功
     req.session.admin = admin;
     req.flash('success', '登录成功！');
     res.redirect('/');
  });
});

module.exports = router;
