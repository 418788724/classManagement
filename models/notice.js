var mongoose = require('./db');
var Schema   = mongoose.Schema;

var NoticeSchema = new Schema({
    noticeTitle: {type: String},
    noticeContent: {type: String},
    userName: {type: String},
    postDate: { type: Object},
    pv: {type: Number, default: 0}
});

var Notice = mongoose.model('Notice', NoticeSchema);
var NoticeDao = function(){};

/**
 * 保存文章
 * @param {String} noticeObj 
 * @param {function} callback 
 */
NoticeDao.prototype.save = function(noticeObj, callback){
    var notice = new Notice(noticeObj);
    notice.save(function(err, res){
        callback(err, noticeObj);
    });
}

/**
 * 查询全部公告
 */

NoticeDao.prototype.findAll = function(noticeObj, callback){
    // Notice.find(function(err, docs){
    //     callback(err, docs);
    // })
    Notice.find({}).sort({'postDate': -1}).exec(function(err, docs){
        callback(err, docs);
    })
}

/**
 * 分页查询
 * 一页10条公告
 */

NoticeDao.prototype.findPage = function(noticeObj, callback){
    // var pageSize = 5;                   //一页多少条
    var pageSize = noticeObj.pageSize;
    // var currentPage = 1;                //当前第几页
    var currentPage = noticeObj.currentPage;
    var sort = {'postDate':-1};        //排序（按发布时间倒序）
    var condition = {};                 //条件
    var skipnum = (currentPage - 1) * pageSize;   //跳过数
    Notice.count(condition, function(err, total){
        Notice.find(condition).skip(skipnum).limit(pageSize).sort(sort).exec(function(err, docs){
            callback(err, docs, total);
        });
    });
}


/**
 * 查询5条公告
 * 用于首页公告
 */
NoticeDao.prototype.findFive = function(noticeObj, callback){
    Notice.find({}).limit(5).sort({'postDate': -1}).exec(function(err, docs){
        callback(err, docs);
    })
}

/**
 * 查询一条公告
 * 用于查看详细公告
 */
NoticeDao.prototype.findOne = function(noticeObj, callback){ 
    var findWhere = {
        "userName": noticeObj.userName,
        "_id": noticeObj._id,
        "noticeTitle": noticeObj.noticeTitle
        // "noticeTitle": "1"
    };
    var updatestr = {
        $inc: {"pv": 1} 
    }
    Notice.findOne(findWhere, function(err, doc){
        Notice.update(findWhere, updatestr, function(err, doc){
        });
        callback(err, doc);
    });
    // Notice.findOne(findWhere, function(err, doc){
    //     callback(err, doc);
    // });
}

/**
 * 更新一条公告
 */

NoticeDao.prototype.update = function(noticeObj, callback){
    var updatestr ={
        // userName: noticeObj.userName, 
        noticeTitle: noticeObj.noticeTitle,
        noticeContent: noticeObj.noticeContent,
        postDate: noticeObj.postDate
    }
    Notice.update({}, updatestr, function(err, doc){
            callback(err, doc);
    });
}

/**
 * 删除一条公告
 */

NoticeDao.prototype.remove = function(noticeObj, callback){
    var condition = {
        userName: noticeObj.userName,
        noticeTitle: noticeObj.noticeTitle,
        _id: noticeObj.noticeId
    };
    Notice.remove(condition, function(err, doc){
        callback(err, doc);
        console.log(doc)
    });
}

module.exports = new NoticeDao();

// var momo = new NoticeDao();

// momo.find(null,function(err, docs){
//     console.log(docs);
// })