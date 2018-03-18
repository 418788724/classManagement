var express = require('express');
var router = express.Router();

var User = require('../models/user');

var checkLogin = require('../middle/checkUser').checkLogin;//登录检查
/* GET home page. */
router.route('/').all(checkLogin).get(function(req, res) {
  User.findAll(null, function(err, users){
    res.render('member/member', {
      title: '班级成员',
      users: users,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  })
});
// .post(function(req, res){
//   var userId = req.body.userId;
//   console.log(userId);
  
// });

/**
 * 学生详情页
 */
router.route('/:username').get(function(req, res){
  var username = req.params.username;
  console.log(username)
  User.findOne(username, function(err, person){
    res.render('member/person', {
      title: 'Express',
      person: person,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    })
  })
})

module.exports = router;