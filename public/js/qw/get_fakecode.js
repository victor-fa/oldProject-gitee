$().ready(function () {
    $("#manage-code-get").click(function(){
        var phone = $("input").val();
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (myreg.test(phone)){
            $.ajax({
                url: '/admin/manage/api/getfakecode',
                type: 'GET',
                data: {
                    "phone": phone
                },
                success: function(data){
                    $("#manage-code-success").css("display","block");
                    $("#manage-code-warning").css("display","none");
                    $("#manage-code-error").css("display","none");
                    $("#manage-code-success p").append(data.code);
                },
                error: function () {
                    $("#manage-code-error").css("display","block");
                    $("#manage-code-success").css("display","none");
                    $("#manage-code-warning").css("display","none");
                }
            });
        } else {
            $("#manage-code-warning").css("display","block");
            $("#manage-code-error").css("display","none");
            $("#manage-code-success").css("display","none");
        }

    });

    $(".close").click(function(){
        $("#manage-code-warning").css("display","none");
            $("#manage-code-error").css("display","none");
            $("#manage-code-success").css("display","none");
    });
})