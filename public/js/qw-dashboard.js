/**
 * Created by yzhang on 7/20/17.
 */

$().ready(function () {
    var appkey = $('#appkey').html();
    var appsecret = $('#appsecret').html();
    var username = $('#username').html();
    var timestamp = Math.floor(Date.now() / 1000);

    var verify = md5(appsecret + timestamp + username);

  
});