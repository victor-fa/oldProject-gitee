$().ready(function(){
    //var deploy_domain_name="robot-service.centaurstech.com";
    //var deploy_domain_name="localhost:10010";
    init();
    
    //页面初始化
    function init(){
        initVcode();
        bindEvents();
    }

    //初始化或者刷新验证码
    function initVcode(){
        $.ajax({
            //url:"//robot-service.centaurstech.com/users/vcode",
            url:"http://localhost:10010/users/vcode",
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

    //验证码错误后操作
    // function vcodeErrorOperate(error_msg){
    //     initVcode();
    //     if($("#vcode_false_warning").hasClass('hidden')){
    //         $("#vcode_false_warning").removeClass('hidden');
    //     }
    //     $("#vcode_false_warning").find(".vcode_warning_content").text(error_msg);
    //     $("#vcode").val("");
    //     //$("#vcode_false_warning").focus();
    //     var mainContainer=$("#page-warpper");
    //     if(!$("#vcode_false_warning").hasClass("hidden")){
    //         mainContainer.animate({
    //             scrollTop: $("#vcode_false_warning").offset().top
    //         }, 1000);
    //     }
        
    // }

    //事件绑定
    function bindEvents(){
        $("#vcode_container").on('click',function(event){
            initVcode();
        });
        // $("#btn_submit").on('click',function(event){
        //     $(".alert.alert-dismissable").addClass("hidden");
        //     if(!$("#vcode").val().trim()){
        //         vcodeErrorOperate("请输入验证码");
        //         return;
        //     }
        //     var _self=$(this);
        //     //校验
        //     $.ajax({
        //         //url:"//users/check_vcode",
        //         url:"http://192.168.1.133:10010/users/check_vcode",
        //         method:"POST",
        //         data:{vcode:$("#vcode").val()},
        //         success:function(data){
        //             if(data&&data.status=="success"){
        //                 _self.closest('form').submit();
        //             }else{
        //                 vcodeErrorOperate("验证码错误，请重新输入");
        //             }
        //         },
        //         error:function(data){
        //             vcodeErrorOperate("验证码错误，请重新输入");
        //         }
        //     })
        //     //
        // });
        $("#vcode").on('keyup',function(event){
            if(event.keyCode==13){
                $(this).closest('form').submit();
            }
        })
    }

});