var express = require('express');
var router = express.Router();

var User = require('../models/user');
var checkLogin = require('../middle/checkUser').checkLogin;//登录检查
/* GET home page. */
router.route('/').all(checkLogin).get(function(req, res) {
  console.log(req.query.username+"/"+req.query._id);
  User.find(function(err, users){
    res.render('chatroom/chatroom', {
      title: '首页',
      user: req.session.user,
      users: users,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  })
});


module.exports = router;
