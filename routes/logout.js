var express = require('express');
var router = express.Router();
var crypto = require('crypto');//Node.js 的一个核心模块,生成散列值来加密密码。
var User = require('../models/user');

var checkLogin = require('../middle/checkUser').checkLogin

router.route('/').all(checkLogin).get(function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功!');
    res.redirect('/');
});

module.exports = router;