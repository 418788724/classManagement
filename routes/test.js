var express = require('express');
var router = express.Router();

var crypto = require('crypto');//加密
var User = require('../models/user');

//var checkNotLogin = require('../middle/checkUser').checkNotLogin;


router.route('/').all().get(function(req, res){
    res.render('test', {
        title: '添加人员测试'
    });
}).post(function(req, res){
    //存储各种时间格式，
    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "_" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    var superman = req.body.superman == 'on' ?  true : false;
    var pass = req.body.password;
    var md5 = crypto.createHash('md5'),
        md5password = md5.update(pass).digest('hex');
    var user ={
        username: req.body.username,                 //用户账号
        studentId: req.body.studentId,
        password: md5password,            //密码 
        number: req.body.number,
        email: req.body.email,
        userage: req.body.age,
        logindate: time,                  //最近登录时间
        superman: superman
    };
    console.log(user);
    console.log(superman);
    User.save(user, function(err, doc){
        if(err){
            console.log('添加出错：'+err);
        }
        console.log(doc);
    });
    res.redirect('/member')
})

module.exports = router;