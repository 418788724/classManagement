var settings = require('../settings');
var mongoose = require('mongoose');
var db       = mongoose.connection
/**
 * 连接数据库
 */
mongoose.connect('mongodb://'+ settings.host+ '/' + settings.db);

/**
 * 连接成功
 */
db.on('connected', function(){
    console.log('连接成功！');
})

/**
 * 连接异常
 */
db.on('error',function (err) {    
    console.log('连接异常: ' + err);  
});    
 
/**
 * 连接断开
 */
db.on('disconnected', function () {    
    console.log('连接断开');  
});   

module.exports = mongoose;