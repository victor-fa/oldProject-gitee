/**
 * Created by yzhang on 7/9/17.
 */

$().ready(function() {

    var appkey = "qiwurobot";
    var appsecret = "123456";

    var timestamp = 1;
    var uid = "og9pHwQplkCRcaLTglCwxmK_C_wk";
    var cid = "597087ddd2239a6f46bb2137";

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
    };

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
        var list = obj.transcript;
        if (list.length == 0) {
            $("log-result-context").html('<li class="list-group-item">没有找到相关日志。</li>')
            console.log("没有找到相关日志");
            return;
        }
        $("#log-result-header").html("总计" + list.length + "条日志");
        var tempHtmlAsk = $('#log-result-temp-ask').html()
        var tempHtmlAnswer = $('#log-result-temp-answer').html();
        var resObj = {};
        for (var i = 0; i < list.length; ++i) {
            var isAsk = (list[i].action != "answer")

            resObj.id = i + 1;
            resObj.timestamp = parseDateTime(list[i].timestamp);
            resObj.action = isAsk ? "问" : "答";
            resObj.msg = list[i].msg;
            var resHtml = (isAsk ? tempHtmlAsk : tempHtmlAnswer).temp(resObj);
            $("#log-result-context").append(resHtml);
        }
    }

    function loadLog() {
        console.log("Sending Request...")

        $("#log-result-header").html("正在载入日志……");
        $.ajax({
            url: 'https://robot-service.centaurstech.com/api/log/session',
            headers: {
                "appkey": appkey,
                "timestamp": timestamp,
                "uid": uid,
                "verify": verify,
                "cid": cid,
            },
            type: 'GET',
            success: ajaxOnSuccess,
            error: function() {
                $('#log-alert-1').show();
                $('#log-alert-2').show();

            }
        });
    };

    loadLog();
});