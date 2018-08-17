function resetPwd_user(){
    var username = $("#resetPwd").val();
    $.ajax({
        url: '/users/resetPwd',
        type: 'GET',
        data: {
            "username": username
        },
        success: function(data){
            alert("密码已发送到您的邮箱，请注意查收！");
        },
        error: function () {
            alert("重置失败！！！");
        }
    });
}

function resetPwd_admin(username){
    $.ajax({
        url: '/admin/manage/api/reset',
        type: 'GET',
        data: {
            "username": username
        },
        success: function(data){
            $("#pwd_span").html("");
            $("#pwd_span").html(data.pwd+"&nbsp;&nbsp;&nbsp;&nbsp;");
            alert("密码已发送到用户邮箱");
        },
        error: function () {
            alert("重置失败！！！");
        }
    });
}
