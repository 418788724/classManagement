var multer = require('multer');
var storage = multer.diskStorage({
    //上传文件路径
    destination: function(req, file, callback){
        callback(null, './public/uploads/tasks/taskStream')
    },
    //给上传文件重命名
    filename: function(req, file, callback){
        var fileFormat = (file.originalname).split(".");
        callback(null, req.session.user.studentId+req.session.user.username+"."+fileFormat[fileFormat.length - 1])
    }
});

//添加配置文件到multer对象
var upload = multer({
    storage: storage
});

module.exports = upload;