;
$(function () {
    $('footer').remove(); //删除脚部
    //侧边栏伸缩
    ;
    $(function () {
        var trigger = $('.hamburger'),
            overlay = $('.overlay'),
            isClosed = false;

        trigger.click(function () {
            hamburger_cross();
        });

        function hamburger_cross() {

            if (isClosed == true) {
                overlay.hide();
                trigger.removeClass('is-open');
                trigger.addClass('is-closed');
                isClosed = false;
            } else {
                overlay.show();
                trigger.removeClass('is-closed');
                trigger.addClass('is-open');
                isClosed = true;
            }
        }
        $('[data-toggle="offcanvas"]').click(function () {
            $('#wrapper').toggleClass('toggled');
        });
    });
    //notice
    $(function () {
        //成功提示
        function SuccessMes(data) {
            //document.getElementById("status").innerHTML += "<p style='color:green; font-weight:bold;'>服务器返回信息: " + data + "</p>";
            alert(data);
            $("#noticeTitle").val('');
            $("#noticeContent").val('');
        }
        //失败提示
        function ErrorMes(){
            alert(data);
            //document.getElementById("status").innerHTML += "<p style='color:#C00000; font-weight:bold;'>连接不到服务器，请检查网络！</p>";
        }
        //发布公告
        $('#noticeSubmit').on('click', function (e) {
            e.preventDefault();
            // var value = $("input").val();
            var notice = {
                noticeTitle: $("#noticeTitle").val(),
                noticeContent: $("#noticeContent").val()
            };
            var jsoninfo = JSON.stringify(notice);
            console.log(jsoninfo);
            var valueTitle = $.trim(notice.noticeTitle);
            var valueContent = $.trim(notice.noticeContent);
            if (valueTitle == ''|| valueContent == '') {
                alert('不能为空！');
            } else {
                //公告提交请求ajax
                req_ajax(jsoninfo, 'post', '/mange/notice','json', SuccessMes, ErrorMes)
            }
        });
        //发布作业
        $('#taskSubmit').on('click', function (e) {
            e.preventDefault();
            // var value = $("input").val();
            var task = {
                taskTitle: $("#taskTitle").val(),
                taskContent: $("#taskContent").val()
            };
            var jsoninfo = JSON.stringify(task);
            console.log(jsoninfo);
            var valueTitle = $.trim(task.taskTitle);
            var valueContent = $.trim(task.taskContent);
            if (valueTitle == ''|| valueContent == '') {
                alert('不能为空！');
            } else {
                //公告提交请求ajax
                req_ajax(jsoninfo, 'post', '/mange/task','json', SuccessMes, ErrorMes)
            }
        });
    });
});