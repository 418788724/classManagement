// import { unescape } from 'querystring';

/**
 * @Name    : chatroom.js
 * @Module  : Socket.io Module
 * @Author  : moenyang
 * @Date    ：2018.02.03
 * @Brief   : chartroom
 */
var Msg = require('./chatroomDao');
var User = require('./user');
var socketio = require('socket.io');


exports.listen = function (server) {
    var io = socketio(server);
    var Count = 0;
    var userServer = {};
    var userList = {};
    var freeList = [];


    //建立连接
    io.on('connection', function (socket) {
        //用户加入时
        var add = false;
        socket.on('join', function (userData) {
            if(add) return;
            //通知所有用户
            //socket.userData = userData;
            var userId = userData.userId,
                username = userData.username,
                avatar = userData.avatar
            //socket.id = userId;
            socket.userData = userData;
            userServer[userId] = socket;
            userList[userId] = username;
            freeList.push(userId);
            ++Count;
            add = true;
            //console.log(userList);
            socket.emit('onlineCount', freeList);
            socket.emit('Count', Count);
            // if(freeList.length > 1){
            //     var from = userId;
            //     A
            // }
            console.log(freeList);
            //console.log(userList);
            socket.broadcast.emit('userJoined', {
                msg: "欢迎" + unescape(socket.userData.username) + "进入聊天室",
                Count: Count,
                type: "BROADCAST",
                onlineUser: freeList
            });
        });


        //发送消息
        socket.on('sendMsg', function (msg) {
            io.emit('resMsg', msg);
        });

        //用户离开
        socket.on('disconnect', function () {
            if(add){
                --Count;
                var id = socket.userData.userId;
                Arrayremove(freeList, id);
                delete userServer[id];
                delete userList[id];
                socket.emit('onlineCount', freeList);
                console.log(freeList);
                // io.emit('offline', {
                //     id: id
                // });
                socket.emit('Count', Count);
                //告知其他用户
                socket.broadcast.emit('userLeft', {
                    msg: unescape(socket.userData.username) + "离开了聊天室！",
                    Count: Count,
                    type: "BROADCAST",
                    onlineUser: freeList
                });
            }
        });
    });

    function Arrayremove(array, name) {
        var len = array.length;
        for (var i = 0; i < len; i++) {
            if (array[i] == name) {
                array.splice(i, 1)
                break
            }
        }
    }
}