/**
 * Created by yzhang on 7/8/17.
 */

$().ready(function () {
    $("#btn-login").click(function () {
        $("#btn-login").addClass("active")
        $("#btn-regis").removeClass("active")
        $("#form-login").show();
        $("#form-regis").hide();
    });

    $("#btn-regis").click(function () {
        $("#btn-regis").addClass("active")
        $("#btn-login").removeClass("active")
        $("#form-regis").show();
        $("#form-login").hide();
    });
});