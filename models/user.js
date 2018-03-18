var mongoose = require('./db');
var Schema   = mongoose.Schema;

var crypto = require('crypto');

var UserSchema = new Schema({
    username: { type: String },             //用户账号
    studentId: {type: Number},              //学号
    password: {type: String},               //密码
    number: {type: Number},                 //电话
    email: {type: String},                  //emill
    userage:{type: Number},                 //年龄
    logindate: {type: Object},              //最近登录时间
    avatar: {type: String, default: './uploads/avatars/logo.png'},
    superman: {type: Boolean}                   
})

var User = mongoose.model('User', UserSchema);
var UserDao = function(){};

/**
 * 保存用户信息
 */
UserDao.prototype.save = function(userObj, callback){
    var user = new User(userObj);
    user.save(function(err, res){
        callback(err, userObj);
    });
}
/**
 * 查询全部用户信息
 */
UserDao.prototype.find = function(callback){
    User.find(function(err, docs){
        callback(err, docs);
    });
}
/**
 * 查询全部学生信息
 */
UserDao.prototype.findAll = function(userObj, callback){
    var condition = {
        "superman": false
    }
    User.find(condition).exec(function(err, docs){
        callback(err, docs);
    })
}
/**
 * id查询
 * 用于聊天室查询
 */
UserDao.prototype.findById = function(id, callback){
    User.findById(id, function(err, doc){
        callback(err,  doc);
    })
}

/**
 * 查询单个人员信息
 */
UserDao.prototype.findOne = function(name, callback){
    User.findOne({username:name}, function(err, obj){
        callback(err, obj);
    });
}

/**
 * 删除个人信息
 */
UserDao.prototype.remove = function(userObj, callback){
    var condition = {
        'username':userObj.username,
        '_id': userObj.userId
    };
    User.remove(condition, function(err, doc){
        callback(err, doc)
    })
}

/**
 * 更新个人信息
 */
UserDao.prototype.update = function(userObj, updateuser, callback){
    var userstr = {
        "_id": userObj._id
    };
    var updatestr ={
        password: updateuser.password,
        number: updateuser.number,
        email: updateuser.email
    };
    User.update(userstr, updatestr, function(err, doc){
            callback(err, doc);
    });
}
/**
 * 更换头像
 */
UserDao.prototype.updateAvatar = function(userObj, updateuser, callback){
    var userstr = {
        "_id": userObj._id
    };
    var updatestr ={
        avatar: updateuser.avatar
    };
    User.update(userstr, updateuser, function(err, doc){
        callback(err, doc);
    });
}


module.exports = new UserDao();
/**
 * 插入
 */

// var momo =  new UserDao();
// //存储各种时间格式，
// var date = new Date();
// var time = {
//     date: date,
//     year: date.getFullYear(),
//     month: date.getFullYear() + "_" + (date.getMonth() + 1),
//     day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
//     minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
//     date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
// };
// var pass = '123'
// var md5 = crypto.createHash('md5'),
//     md5password = md5.update(pass).digest('hex');
// var user ={
//     username: 'momo1',                 //用户账号
//     password: md5password,            //密码 
//     number: 18408289351,
//     email: '418788724@qq.com',
//     userage: 20,
//     logindate: time,                  //最近登录时间
//     superman: false
// };
// // 加密
// //md5加密用户密码
// momo.save(user,function(err, res){
//     if(err){
//         console.log("插入错误："+err);
//     }else{
//         console.log('插入成功：'+res);
//     }
// });
