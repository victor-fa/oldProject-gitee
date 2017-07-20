/**
 * Created by yzhang on 7/20/17.
 */
/**
 * Created by yzhang on 7/9/17.
 */

$().ready(function() {

    var appkey = "wechat";
    var appsecret = "123456";

    var timestamp = Math.floor(Date.now() / 1000);
    var uid = "WhoIsLittleFeli";

    var search = location.search
    if (search) {
        uid = getParameterByName('uid')
        cid = getParameterByName('cid')
    }

    var verify = md5(appsecret + uid + timestamp);

    String.prototype.temp = function(obj) {
        return this.replace(/\$\w+\$/gi, function(matches) {
            var ret = obj[matches.replace(/\$/g, "")];
            if (ret == "") {
                ret = "N/A";
            }
            return (ret + "") == "undefined" ? matches : ret;
        });
    }

    function parseDateTime(timestamp) {
        var date = new Date(timestamp);

        var year = date.getFullYear();
        var month = date.getMonth();
        var dates = date.getDate();
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedDateTime = year + '-' + month + '-' + dates + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedDateTime;
    }

    function ajaxOnSuccess(obj) {
        console.log("Got Respond.");
        console.log(obj)
        var seessions = obj.sessions;
        if (seessions.length == 0) {
            $("#log-result-context").html('<li class="list-group-item">没有找到相关日志。</li>')
            console.log("没有找到相关日志");
            return;
        }
        $("#log-result-header").html("总计" + seessions.length + "条日志");
        var tempListHtmlAsk = $('#log-list-result').html()
        var resObj = {};
        for (var i = 0; i < seessions.length; ++i) {
            resObj.id = i + 1;
            resObj.timestamp = parseDateTime(seessions[i].timestamp);
            resObj.app = seessions[i].app;
            resObj.nickname = seessions[i].nickname;
            resObj.uid = seessions[i].uid;
            resObj.cid = seessions[i].cid;
            var resHtml = tempListHtmlAsk.temp(resObj);
            $("#log-result-context").append(resHtml);
        }
    }

    function loadLogList() {
        console.log("Sending Request...")

        $("#log-result-header").html("正在载入日志……");
        $.ajax({
            url: 'https://robot-service.centaurstech.com/api/log/list',
            headers: {
                "appkey": appkey,
                "timestamp": timestamp,
                "uid": uid,
                "verify": verify,
                "size": 10,
            },
            type: 'GET',
            success: ajaxOnSuccess,
            error: function() {
                $("#log-result-header").html('没有找到相关日志列表。')
                $('#log-alert-1').show();
                $('#log-alert-2').show();
            }
        });
    };

    loadLogList();
});