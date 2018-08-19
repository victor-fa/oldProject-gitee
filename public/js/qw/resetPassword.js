$("#resetPwd").next().click(function (){
    var username = $("#resetPwd").val();
    if(username!=""){
        $.ajax({
            url: '/users/resetPwd',
            type: 'GET',
            data: {
                "username": username
            },
            success: function(data){
                var str = "";
                if("1"==data.pwd){
                    str = "该用户不存在";
                }else{
                    str = "密码已发送到您的邮箱，请注意查收！";
                }
                alert(str);
            },
            error: function () {
                alert("重置失败！！！");
            }
        });
    }else{
        alert("用户名不能为空");
    }
})

$("#pwd_btn").click(function (){
    var username = $(".list-group-item-text-data:eq(1)").html();
    $.ajax({
        url: '/admin/manage/api/reset',
        type: 'GET',
        data: {
            "username": username
        },
        success: function(data){
            var str = "";
            if("1"==data.pwd){
                str = "该用户不存在";
            }else{
                str = "密码已发送到用户邮箱";
                $("#pwd_span").html(data.pwd+"&nbsp;&nbsp;&nbsp;");
            }
            alert(str);
        },
        error: function () {
            alert("重置失败！！！");
        }
    });
})
