;
$(function () {
    $('footer').remove();
    // 基本功能函数-------------
    //获取人数量
    function ol_pad(num, n) {
        num = "" + num
        var temp = num;

        for (var i = 0; i < (n - num.length); i++) {
            temp = "0" + temp
        }
        return temp
    }

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    //获取地址栏信息
    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串 
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    //获取时间
    function GetDateTime() {
        var obj = new Date();
        return (obj.getFullYear() + "/" + ol_pad(obj.getMonth() + 1, 2) + "/" + ol_pad(obj.getDate(), 2) + " " + ol_pad(obj.getHours(), 2) + ":" + ol_pad(obj.getMinutes(), 2) + ":" + ol_pad(obj.getSeconds(), 2));
    }
    // 基本功能函数-------------
    //- 启动
    //var socket = io.connect('http://127.0.0.1:3000');
    var socket = io.connect();
    console.log(GetQueryString('username'));
    var userData = {
        userId: GetQueryString('userId'),
        username: escape($('#sessionName').text()),
        avatar: GetQueryString('avatar')
    };
    //
    //加入成员
    socket.emit('join', userData);
    socket.on('Count', function(Count){
        $('#guestNum').html(Count+"人");
    });

    //告知其他成员有人加入群聊
    socket.on('userJoined', function(data){
        $('#msg_container').append('<div class=noticeBubble><span>'+data.msg+'</span></div>');
        $('#guestNum').html(data.Count+"人");
        var allUser = [], j=0;
        $('li.userOne').each(function(){
            allUser.push($(this).data('id'));
        });
        for(var i=0;i<data.onlineUser.length;i++){
            for(var k=0;k<allUser.length;k++){
                if(data.onlineUser[i] == allUser[k]){
                    $('#'+data.onlineUser[i]).removeClass('gray')
                }
            }
        }
    });
    //告知其他成员有人退出群聊
    socket.on('userLeft', function(data){
        $('#msg_container').append('<div class=noticeBubble><span>'+data.msg+'</span></div>');
        $('#guestNum').html(data.Count+"人");
        var allUser = [], j=0;
        $('li.userOne').each(function(){
            allUser.push($(this).data('id'));
        });
        for(var i=0;i<data.onlineUser.length;i++){
            for(var k=0;k<allUser.length;k++){
                if(data.onlineUser[i] == allUser[k]){
                    $('#'+data.onlineUser[i]).addClass('gray')
                }
            }
        }
    })
    socket.on('onlineCount', function(freeList){
        var allUser = [], j=0;
        $('li.userOne').each(function(){
            allUser.push($(this).data('id'));
        });
        for(var i=0;i<freeList.length;i++){
            for(var k=0;k<allUser.length;k++){
                if(freeList[i] == allUser[k]){
                    $('#'+freeList[i]).removeClass('gray')
                }
            }
        }
    })
    //发送消息
    $('#msgSend').on('click', function () {
        var msgInput = $('#msgInput').val();
        var username = $('#sessionName').html();
        var msg = '<p><span class=msgBubble>' + msgInput + '</span></p>';
        var data = {
            msg: msgInput,
            username: username
        };
        socket.emit('sendMsg', data);
        $('#msgInput').val('');
    });
    socket.on('resMsg', function (data) {
        $('#msg_container').append('<p class=msg-sendcont><span class=userBubble>'+data.username+':</span><span class=msgBubble>'+data.msg+'</span></p>');
    });

});