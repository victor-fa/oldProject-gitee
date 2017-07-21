/**
 * Created by yzhang on 7/20/17.
 */
/**
 * Created by yzhang on 7/9/17.
 */

$().ready(function () {
    var appkey = "wechat";
    var appsecret = "123456";
    var size = 50;

    var timestamp = Math.floor(Date.now() / 1000);
    var uid = "WhoIsLittleFeli";

    var search = location.search
    if (search) {
        uid = getParameterByName('uid')
        cid = getParameterByName('cid')
    }

    var verify = md5(appsecret + uid + timestamp);

    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matches) {
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
        var month = date.getMonth() + 1;
        var dates = date.getDate();
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        if (month < 10) month = '0' + month;
        if (dates < 10) dates = '0' + dates;
        if (hours < 10) hours = '0' + hours;

        // Will display time in 10:30:23 format
        var formattedDateTime = year + '-' + month + '-' + dates + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedDateTime;
    }

    function ajaxOnSuccess(obj) {
        console.log("Got Respond.");
        var seessions = obj.sessions;
        if (seessions.length == 0) {
            $("#log-result-context").html('<li class="list-group-item">没有找到相关日志列表。</li>')
            console.log("没有找到相关日志列表");
            return;
        }
        $("#log-result-header").html("总计" + seessions.length + "条日志列表");
        var tempListHtmlAsk = $('#log-list-result').html()
        var resObj = {};
        var width = Math.ceil(Math.log10(seessions.length));
        for (var i = 0; i < seessions.length; ++i) {
            resObj.id = zeroFill(i + 1, width);
            resObj.timestamp = parseDateTime(seessions[i].timestamp);
            resObj.app = seessions[i].app;
            resObj.nickname = (seessions[i].nickname).trim();
            resObj.uid = seessions[i].uid;
            resObj.cid = seessions[i].cid;
            var resHtml = tempListHtmlAsk.temp(resObj);
            $("#log-result-context").append(resHtml);
        }
        addItemBg();
    }

    function zeroFill( number, width )
    {
        width -= number.toString().length;
        if ( width > 0 )
        {
            return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
        }
        return number + ""; // always return a string
    }

    function loadLogList() {
        console.log("Sending Request...")

        $("#log-result-header").html("正在载入日志列表……");
        $.ajax({
            url: 'https://robot-service.centaurstech.com/api/log/list',
            headers: {
                "appkey": appkey,
                "timestamp": timestamp,
                "uid": uid,
                "verify": verify,
                "size": size,
            },
            type: 'GET',
            success: ajaxOnSuccess,
            error: function () {
                $("#log-result-header").html('没有找到相关日志列表。')
                $('#log-alert-1').show();
                $('#log-alert-2').show();
            }
        });

    };

    function addItemBg() {
        for (var i = 0; i < size; i++) {
            if (i % 2 == 1) {
                var selector = '.list-group-item:nth-child(' + i + ')';
                $(selector).css('background-color', '#f9f9f9');
            }
        }
    }

    loadLogList();
});