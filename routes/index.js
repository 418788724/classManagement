var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

var Notice = require('../models/notice');
var schoolUrl = 'http://www.sptpc.com/Category_1/Index.aspx';
//var checkLogin = require('../middle/checkUser').checkLogin;//登录检查
/* GET home page. */

router.route('/').get(function (req, res) {
  // function filterChapters(Url) {
    var photoUrlArray = [];
    request(schoolUrl, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        //返回的body为抓到的网页的html内容
        var $ = cheerio.load(body); //当前的$符相当于拿到了所有的body里面的选择器
        var carousel = $('#focusAd>.bd>ul').children('li');
        carousel.each(function (item) {
          //获取图片地址
          var photoUrl = 'http://www.sptpc.com'+$(this).find('.pic>a>img').attr('src');
          photoUrlArray.push(photoUrl);
        });
        // console.log(photoUrlArray);
        var cNum = photoUrlArray.length;
        //console.log(photoUrlArray);
        Notice.findFive(null, function (err, notices) {
          if (err) {
            notices = [];
          }
          //console.log(notices);
          res.render('index/index', {
            title: '首页',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            carousels: photoUrlArray,
            cNum: cNum,
            notices: notices
          });
        });
      }
    });
  //}
  //var photoArray = filterChapters(schoolUrl);
  //var photoNum   = photoArray.length;
  //console.log(photoArray)
});


module.exports = router;