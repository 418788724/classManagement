var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var Notice = require('../models/notice');  //公告
var Task = require('../models/task');   //作业
var User = require('../models/user');

var checkLogin = require('../middle/checkUser').checkLogin; //登录检查
//是否为管理员检查
var mangeLogin = function (req, res, next) {
    if (!req.session.user.superman) {
        req.flash('errpr', '你不是管理员，无法进入');
        res.redirect('back');
    }
    next();
}

/* GET mange页. */
router.route('/').all(checkLogin, mangeLogin).get(function (req, res) {
    var modTit = {
        notice: '公告发布',
        task: '作业发布'
    }
    res.render('mange/mange', {
        title: '管理',
        modTit: modTit,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});
/**
 * 公告管理------------------
 **/
router.route('/notice').get(function(req, res){
    var page = req.query.page ? parseInt(req.query.page) : 1;
    var noticeObj = {
            pageSize: 10, //一页5条
            currentPage: page //当前页数
        };
    Notice.findPage(noticeObj, function (err, notices, total) {
        res.render('mange/notice/mangeNotice', {
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
}).post(function (req, res) {
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
    /**
     * ajax提交的数据
     * type: post
     * info: 提交的信息
     */
    var ajaxinfo = {
        type: req.body.type,
        info: req.body.info
    };
    //转为json对象
    var json_parse = JSON.parse(ajaxinfo.info);
    console.log(json_parse);
    // 插入数据库的信息
    var notice = {
        noticeTitle: json_parse.noticeTitle,
        noticeContent: json_parse.noticeContent,
        userName: req.session.user.username,
        postDate: time
    };
    Notice.save(notice, function (err) {
        if (err) {
            console.log("发表出错！");
            req.flash('error', '发表出错！')
            return res.redirect('back');
        }
        //console.log('发表成功！');
        //req.flash('success', '发表成功');
        res.json('发表成功！');
        //res.redirect('/mange')
    });
});

/**
 * 翻页请求
 */

// router.get('/noticeAjax', function(req, res){
//     var page = req.query.info ? parseInt(req.query.info) : 1;
//     var noticeObj = {
//             pageSize: 10, //一页5条
//             currentPage: page //当前页数
//         };
//     Notice.findPage(noticeObj, function (err, notices, total) {
//         res.render('mange/notice', {
//             page: page,
//             isFirstPage: (page - 1) == 0,
//             isLastPage: ((page - 1) * 10 + notices.length) == total,
//             user: req.session.user,
//             success: req.flash('success').toString(),
//             error: req.flash('error').toString(),
//             notices: notices,
//             total: total
//         });
//     });

// });

/**
 * 公告修改
 */
router.route('/notice/edit/:userName/:noticeTitle/:_id').get(function (req, res) {
    var noticeObj = {
        userName: req.params.userName,
        noticeTitle: req.params.noticeTitle,
        _id: req.params._id
    };
    Notice.findOne(noticeObj, function (err, doc) {
        if (err) {
            req.flash('error', err);
            return resizeBy.redirect('back');
        }
        res.render('mange/notice/edit', {
            noticeTitle: '公告修改',
            notice: doc,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
}).post(function (req, res) {
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
    var noticeObj = {
        noticeTitle: req.body.noticeTitle,
        noticeContent: req.body.noticeContent,
        postDate: time
    }
    console.log(noticeObj.postDate);
    Notice.update(noticeObj, function (err, doc) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        req.flash('success', '修改成功！');
        res.redirect('/mange/notice');
    })
});

/**
 * 文章删除
 */
router.route('/notice/remove/:userName/:noticeTitle/:_id').get(function (req, res) {
    var noticeObj = {
        userName: req.params.userName,
        noticeTitle: req.params.noticeTitle,
        noticeId: req.params._id
    }
    console.log(noticeObj.userName, noticeObj.noticeTitle, noticeObj.noticeId);
    Notice.remove(noticeObj, function (err, doc) {
        if(err){
            req.flash('error', err);
            return res.redirect('back');
        }
        req.flash('success', '删除成功！');
        console.log('删除成功！')
        res.redirect('/mange/notice');
    });
});
//公告管理------------------

/**
 * 学籍管理----------------
 */
router.route('/school').get(function(req, res){
    User.findAll(null, function(err, users){
        res.render('mange/school/mangeSchool', {
            title: '学籍管理',
            users:users,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});

//学籍详细信息查询
router.route('/school/:username').get(function(req, res){
    var username = req.params.username;
    User.findOne(username, function(err, person){
        res.render('mange/school/person', {
            title: '学籍管理',
            person: person,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});
//删除个人信息
router.route('/school/remove/:username/:_id').get(function(req, res){
    var userObj = {
        username: req.params.username,
        userId: req.params._id
    }
    User.remove(userObj, function(err, doc){
        if(err){
            console.log('删除失败：'+err)
        }
        req.flash('success', '删除成功！');
        console.log('删除成功！')
        res.redirect('/mange/school');
    });
});



//学籍管理-------------------

/**
 * 课程管理--------------------
 */
router.route('/course').get(function(req, res){
    res.render('mange/course/mangeCourse', {
        title: '课程管理',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});
//课程管理------------------------
/**
 * 作业管理-------------------------
 */
router.route('/task').get(function(req, res){
    var page = req.query.page ? parseInt(req.query.page) : 1;
    var taskObj = {
            pageSize: 10, //一页5条
            currentPage: page //当前页数
        };
    Task.findPage(taskObj, function(err, tasks, total){
        res.render('mange/task/mangeTask', {
            title: '作业管理',
            page: page,
            isFirstPage: (page - 1) == 0,
            isLastPage: ((page - 1) * 10 + tasks.length) == total,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            tasks: tasks,
            total: total
        });
    });
}).post(function (req, res) {
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
    /**
     * ajax提交的数据
     * type: post
     * info: 提交的信息
     */
    var ajaxinfo = {
        type: req.body.type,
        info: req.body.info
    };
    //转为json对象
    var json_parse = JSON.parse(ajaxinfo.info);
    console.log(json_parse);
    // 插入数据库的信息
    var task = {
        taskTitle: json_parse.taskTitle,
        taskContent: json_parse.taskContent,
        userName: req.session.user.username,
        postDate: time
    };
    Task.save(task, function (err) {
        if (err) {
            console.log("发布出错！");
            req.flash('error', '发布出错！')
            return res.redirect('back');
        }
        //console.log('发表成功！');
        //req.flash('success', '发表成功');
        res.json('发布成功！');
        //res.redirect('/mange')
    });
    // var taskPath = path.resolve('./public/uploads/tasks/'+req.session.user.username);
    // if(!fs.existsSync(taskPath)){
    //     fs.mkdirSync(taskPath);
    // }
});

/**
 * 作业修改
 */
router.route('/task/edit/:userName/:taskTitle').get(function (req, res) {
    var taskObj = {
        userName: req.params.userName,
        taskTitle: req.params.taskTitle
    };
    Task.findOne(taskObj, function (err, doc) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        res.render('mange/task/edit', {
            taskTitle: '作业修改',
            task: doc,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
}).post(function (req, res) {
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
    var taskObj = {
        taskTitle: req.body.taskTitle,
        taskContent: req.body.taskContent,
        postDate: time
    }
    console.log(taskObj.postDate);
    Task.update(taskObj, function (err, doc) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        req.flash('success', '修改成功！');
        res.redirect('/mange/task');
    })
});

/**
 * 作业删除
 */
router.route('/task/remove/:userName/:taskTitle/:_id').get(function (req, res) {
    var taskObj = {
        userName: req.params.userName,
        taskTitle: req.params.taskTitle,
        taskId: req.params._id
    }
    console.log(taskObj.userName, taskObj.taskTitle, taskObj.taskId);
    Task.remove(taskObj, function (err, doc) {
        if(err){
            req.flash('error', err);
            return res.redirect('back');
        }
        req.flash('success', '删除成功！');
        console.log('删除成功！')
        res.redirect('/mange/task');
    });
});


//作业管理------------------------
 /**
  * 成绩管理----------------------------
  */
router.route('/score').get(function(req, res){
    res.render('mange/score/mangeScore', {
        title: '成绩管理',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});
//成绩管理--------------------------






module.exports = router;