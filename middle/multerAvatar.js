var multer = require('multer');
var storage = multer.diskStorage({
    //设置上传文件路径
    destination: function(req, file, callback){
        callback(null, './public/uploads/avatars')
    },
    //给上传文件重命名
    filename:function(req, file, callback){
        var fileFormat = (file.originalname).split(".");
        // console.log(fileFormat[fileFormat.length - 1])
        callback(null, req.session.user.username+req.session.user.studentId+"."+fileFormat[fileFormat.length - 1])
    }
});

//添加配置文件到multer对象
var upload = multer({
    storage: storage
});

module.exports = upload;