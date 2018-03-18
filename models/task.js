var mongoose = require('./db');
var Schema   = mongoose.Schema;

var TaskSchema = new Schema({
    taskTitle: {type: String},
    taskContent: {type: String},
    userName: {type: String},
    postDate : { type: Object},
    pv: {type: Number, default: 0},
    taskCount: {type: Number, default:0},
    taskUrl: {type: Array}
});

var Task = mongoose.model('task', TaskSchema);
var TaskDao = function(){};

/**
 * 保存作业
 * @param {String} taskObj 
 * @param {function} callback 
 */
TaskDao.prototype.save = function(taskObj, callback){
    var task = new Task(taskObj);
    task.save(function(err, res){
        callback(err, taskObj);
    });
}

/**
 * 查询全部作业
 */

TaskDao.prototype.findAll = function(taskObj, callback){
    // Notice.find(function(err, docs){
    //     callback(err, docs);
    // })
    Task.find({}).sort({'postDate': -1}).exec(function(err, docs){
        callback(err, docs);
    })
}

/**
 * 分页查询
 * 一页10条作业
 */

TaskDao.prototype.findPage = function(taskObj, callback){
    // var pageSize = 5;                   //一页多少条
    var pageSize = taskObj.pageSize;
    // var currentPage = 1;                //当前第几页
    var currentPage = taskObj.currentPage;
    var sort = {'postDate':-1};        //排序（按发布时间倒序）
    var condition = {};                 //条件
    var skipnum = (currentPage - 1) * pageSize;   //跳过数
    Task.count(condition, function(err, total){
        Task.find(condition).skip(skipnum).limit(pageSize).sort(sort).exec(function(err, docs){
            callback(err, docs, total);
        });
    });
};

/**
 * 查询一条作业
 * 用于查看详细作业
 */
TaskDao.prototype.findOne = function(taskObj, callback){ 
    var findWhere = {
        "userName": taskObj.userName,
        // "postDate": taskObj.postDate,
        "taskTitle": taskObj.taskTitle
        // "noticeTitle": "1"
    };
    var updatestr = {
        $inc: {"pv": 1} 
    }
    Task.findOne(findWhere, function(err, doc){
        Task.update(findWhere, updatestr, function(err, doc){
            //callback(err, doc);
        })
        callback(err, doc);
    });
};

/**
 * 用于记录作业提交
 */
TaskDao.prototype.findtask = function(taskObj, callback){
    var findWhere = {
        "_id": taskObj._id
    };
    Task.findOne(findWhere, function(err, doc){
        callback(err, doc);
    });
}
/**
 * 更新一条作业
 */

TaskDao.prototype.update = function(taskObj, callback){
    var updatestr ={
        // userName: taskObj.userName, 
        taskTitle: taskObj.taskTitle,
        taskContent: taskObj.taskContent,
        postDate: taskObj.postDate
    }
    Task.update({}, updatestr, function(err, doc){
            callback(err, doc);
    });
}
/**
 * 更新提交的作业
 */
TaskDao.prototype.updateTask = function(taskObj, updateTask, callback){
    var taskstr = {
        "_id": taskObj._id
    };
    var updatestr = {
        "taskUrl": updateTask.taskUrl,
        "taskCount": updateTask.taskCount
    }
    Task.update(taskstr, updatestr, function(err, doc){
        callback(err, doc);
    });
}

/**
 * 删除一条作业
 */

TaskDao.prototype.remove = function(taskObj, callback){
    var condition = {
        userName: taskObj.userName,
        taskTitle: taskObj.taskTitle,
        _id: taskObj.taskId
    };
    Task.remove(condition, function(err, doc){
        callback(err, doc);
        console.log(doc)
    });
};


module.exports = new TaskDao();