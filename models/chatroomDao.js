var mongoose = require('./db');
var Schema = mongoose.Schema;

var MsgSchema = new Schema({
    msgUser: {type: String},  //发消息用户名
    msgContent: {type: String}, //消息内容
    msgDate: {type: Object} //消息发送时间
});

var Msg = mongoose.model('Msg', MsgSchema);

/**
 * git in momobranch  fsds
 */

module.exports = Msg;
