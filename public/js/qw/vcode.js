$().ready(function(){
    var chat_api_domain = $('#chatapi').html();
    //var deploy_domain_name="robot-service.centaurstech.com";
    //var deploy_domain_name="localhost:10010";
    init();
    
    //页面初始化
    function init(){
        //updateVcode();
        if($(".alert.alert-danger.alert-dismissable").length>=0){
            $(".container-fluid form")[0].scrollIntoView();
        }
        initVcode();
        bindEvents();
    }
    
    //初始化
    function initVcode(){
        $("#vcode_container").html($("#temp_img").val());
        $("#vcode_container").children(":first").css('border','1px solid #ccc');
    }

    //刷新验证码
    function updateVcode(){
        $.ajax({
            url: chat_api_domain + "/users/vcode",
            success:function(data){
                if(data&&data.img){
                    $("#vcode_container").html(data.img);
                    $("#vcode_container").children(":first").css('border','1px solid #ccc');
                }
            },
            error:function(data){
                console.log(data);
            }
        });
    }

    //事件绑定
    function bindEvents(){
        $("#vcode_container").on('click',function(event){
            updateVcode();
        });
        $("#vcode").on('keyup',function(event){
            if(event.keyCode==13){
                $(this).closest('form').submit();
            }
        })
    }

});