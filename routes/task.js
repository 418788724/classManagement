var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
//var zlib = require('zlib');
var zipper = require('zip-local'); //压缩

var Task = require('../models/task');
var multer = require('../middle/multerTask');//文件上传中间件
var uploadTask = multer.single('task');//上传作业

/* GET home page. */
router.get('/', function (req, res, next) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.page ? parseInt(req.query.page) : 1;
    var taskObj = {
      pageSize: 10,        //一页5条
      currentPage: page   //当前页数
    }
    //获取全部作业
    Task.findPage(taskObj, function (err, tasks, total) {
      if (err) {
        tasks = [];
      }
      // console.log(tasks);
      res.render('task/task', {
        title: '班级作业',
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
  });


/**
 * 作业详情页
 */
router.route('/:userName/:taskTitle').get(function (req, res, next) {
    var findWhere = {
      taskTitle: req.params.taskTitle,
      userName: req.params.userName
    };
    Task.findOne(findWhere, function (err, task) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/task');
      }
      res.render('task/article', {
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        task: task
      });
    });
});

/**
 * 提交作业响应
 */
router.post('/uptask', function(req, res){
    //接受提交作业
    uploadTask(req, res, function(err){
      if(err){
        return console.log(err);
      }
      var findWhere = {
        _id: req.body.publisher
      };
      console.log(req.file.filename);
      //通过ID查询文章
      Task.findtask(findWhere, function(err, task){
        if(err){
          console.log(err);
        }
        var teacher = path.resolve('./public/uploads/tasks/'+task.userName);
        var taskPath = path.resolve(teacher+'/'+task.taskTitle);
        if(!fs.existsSync(teacher)){
            fs.mkdirSync(teacher);
        }
        if(!fs.existsSync(taskPath)){
          fs.mkdirSync(taskPath);
        }
        //文件复制
        var fileName = req.file.filename;
        var sourceFile = path.join('./public/uploads/tasks/taskStream/', fileName);
        var destPath = path.join(taskPath, fileName);

        var readStream = fs.createReadStream(sourceFile);
        var writeStream = fs.createWriteStream(destPath);
        readStream.pipe(writeStream);
        fs.unlinkSync(sourceFile);
        console.log("移动完成！");
        //遍历目标文件夹
        if(fs.existsSync(taskPath)){
          fs.readdir(taskPath, function(err, files){
            if(err){
              console.warn(err);
              return;
            }
            var count = files.length;
            console.log(count);
            console.log(files);
            //添加路径
            // var setTask = new Set(files);
            // var arrayTask = Array.from(new Set([...setTask].map(val => './public/uploads/tasks/'+task.userName+'/'+ val)));
            // console.log(arrayTask);
            var updateTask = {
              taskUrl: files,
              taskCount: count
            };
            //作业目录及数目添加进数据库
            Task.updateTask(findWhere, updateTask, function(err, doc){
              if(err){
                console.log("更新错误"+err);
              }
              console.log(doc);
            });
          });
        }else{
          console.log(taskPath+"Not Found!")
        }
      });
      console.log(req.body.publisher);
      console.log(req.file.path);
      res.send({msg:"上传成功！"})
    });
});
/**
 * 下载作业
 */
router.get('/download', function(req, res){
  var findWhere = {
    _id: req.query.taskId
  };
  Task.findtask(findWhere, function(err, task){
    var teacher = path.resolve('./public/uploads/tasks/'+task.userName);
    var taskPath = path.resolve(teacher+'/'+task.taskTitle);
    var zipPath = path.resolve(teacher+'/zip');
    var filename = task.taskTitle+'.zip';

    if(!fs.existsSync(zipPath)){
      fs.mkdirSync(zipPath);
    };
    zipper.sync.zip(taskPath).compress().save(zipPath+'/'+task.taskTitle+'.zip')
    var downLoadPath = zipPath+'/'+task.taskTitle+'.zip';
    res.download(downLoadPath, filename, function(err){
      if(err){
        console.log(err);
      }else{
        fs.unlinkSync(downLoadPath);
      }
    });
  });
});

module.exports = router;