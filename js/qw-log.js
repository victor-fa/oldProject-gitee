/**
 * Created by yzhang on 7/9/17.
 */

$().ready(function () {
    var appkey = "qiwurobot";
    var timestamp = 1;
    var uid = "og9pHwRvVAGT2iltk9K934RUgTNE";
    var verify = "919123e6bc1851865c2cecbac9342d61";

    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matches) {
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
        var tempHtml = $('#log-result-temp').html();
        var resObj = {};
        for (var i = 0; i < list.length; ++i) {
            resObj.id = i + 1;
            resObj.timestamp = parseDateTime(list[i].timestamp);
            resObj.action = (list[i].action == "answer") ? "答" : "问";
            resObj.msg = list[i].msg;
            var resHtml = tempHtml.temp(resObj);
            $("#log-result-context").append(resHtml);
        }
    }

    function loadLog() {
        console.log("Sending Request...")

        $("#log-result-header").html("正在载入日志……");
        $.ajax({
            url: 'https://robot-service.centaurstech.com/api/chat/log',
            headers: {
                "appkey": appkey,
                "timestamp": timestamp,
                "uid": uid,
                "verify": verify
            },
            type: 'GET',
            success: ajaxOnSuccess,
            error: function () {
                alert("Ajax request failed, please check your internet!")
            }
        });
    };

    loadLog();
});