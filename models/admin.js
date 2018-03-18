var mongoose = require('./db');
var Schema   = mongoose.Schema;

var adminSchema = new Schema({
    username : { type: String },                    //用户账号
    password: {type: String},                       //密码                      //年龄
    logindate : { type: Date}                       //最近登录时间
})

var Admin = mongoose.model('admin', adminSchema);
var AdminDao = function(){};

/**
 * 保存用户信息
 */
AdminDao.prototype.save = function(obj, callback){
    var admin = new Admin(obj);
    admin.save(function(err, res){
        callback(err, obj);
    });
}

/**
 * 查询
 */
AdminDao.prototype.find = function(name, callback){
    Admin.findOne({username:name}, function(err, obj){
        callback(err, obj);
    });
}


// module.exports = new AdminDao();

// var momo =  new AdminDao();

// var wherestr = 'momo1';
// momo.findOne(wherestr, function(err, res){
//     if(err){
//         console.log("查询错误："+err);
//     }else{
//         console.log('查询成功：'+res);
//     }
// });