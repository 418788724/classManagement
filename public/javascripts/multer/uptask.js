$(function(){
    $("#task").on("change", function(e){
        var e = e || window.event;
        var files = e.target.files;
        var file = files[0];
        //作业上传
        $("#uptask").off("click").on("click", function(){
            var publisher = $("#publisher").val();
            var formData = new FormData();
            formData.append('task', file);
            formData.append('publisher', publisher);
            console.log(file);
            alert(file);
            $.ajax({
                url: "/task/uptask",
                type: "post",
                data: formData,
                contentType: false,
                processData: false,
                success: function(data){
                    console.log(data);
                },
                error: function(err){
                    console.log('错误：'+err);
                }
            });
        });
    });
});