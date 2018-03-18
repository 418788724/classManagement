var express = require('express');
var router = express.Router();

var Notice = require('../models/notice');

//var checkLogin = require('../middle/checkUser').checkLogin;//登录检查
/* GET home page. */
router.route('/').get(function (req, res) {
  //判断是否是第一页，并把请求的页数转换成 number 类型
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var noticeObj = {
    pageSize: 10,        //一页5条
    currentPage: page   //当前页数
  }
  //获取全部文章
  Notice.findPage(noticeObj, function (err, notices, total) {
    if (err) {
      notices = [];
    }
    // console.log(notices);
    res.render('notice/notice', {
      title:'班级公告',
      page: page,
      isFirstPage: (page - 1) == 0,
      isLastPage: ((page - 1) * 10 + notices.length) == total,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      notices: notices,
      total: total
    });
  });
});

/**
 * 文章详情页
 */
router.route('/:userName/:noticeTitle/:_id').get(function (req, res) {
  var findWhere = {
    noticeTitle: req.params.noticeTitle,
    userName: req.params.userName,
    _id: req.params._id
  }
  Notice.findOne(findWhere, function (err, notice) {
    // if(err) {
    //   req.flash('error', err);
    //   return res.redirect('/notice');
    // }
    res.render('notice/article', {
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
      notice: notice
    });
  });
});


module.exports = router;