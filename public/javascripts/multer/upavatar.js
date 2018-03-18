$(function(){
    $("#fileavatar").on("change", function(e){
        var e = e || window.event;
        var files = e.target.files;
        var file = files[0];
        
        //作业上传
        $("#upavatar").off("click").on("click", function(){
            var formData = new FormData();
            formData.append('fileavatar', file);
            $.ajax({
                url: "/space/upavatar",
                type: "post",
                data: formData,
                contentType: false,
                processData: false,
                success: function(data){
                    alert(data.msg);
                },
                error: function(err){
                    alert('上传失败：'+err);
                }
            });
        });
    });
});