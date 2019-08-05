$().ready(function () {
    var chat_api_domain = $('#chatapi').html();
    var appkey = $('#appkey').html();
    var appsecret = $('#appsecret').html();
    var timestamp = Math.floor(Date.now() / 1000);

    var uid = "unknowUID";
    var cid = "unknowCID";

    $("#log-prev-page").click(function () {
        (pageNum < 1) ? (pageNum = 0) : (pageNum -= 1);
        loadLogList();
    });

    var search = location.search;
    if (search) {
        uid = getParameterByName('uid');
        cid = getParameterByName('cid');
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
    };

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
        var list = obj.transcript;
        if (list.length == 0) {
            $("#log-result-context").html('<li class="list-group-item">没有找到相关日志。</li>')
            console.log("没有找到相关日志");
            return;
        }
        $("#log-result-header").html("总计" + list.length + "条日志");
        var tempHtmlAsk = $('#log-result-temp-ask').html()
        var tempHtmlAnswer = $('#log-result-temp-answer').html();
        var resObj = {};
        var width = Math.ceil(Math.log10(list.length));
        for (var i = 0; i < list.length; ++i) {
            var isAsk = (list[i].action != "answer")
            resObj.id = zeroFill(i + 1, width);
            resObj.timestamp = parseDateTime(list[i].timestamp);
            resObj.action = isAsk ? "用户提问" : "齐悟回答";
            resObj.msg = list[i].msg;
            var resHtml = (isAsk ? tempHtmlAsk : tempHtmlAnswer).temp(resObj);
            $("#log-result-context").append(resHtml);
        }

        download_params = 'appkey=' + appkey + '&timestamp=' + timestamp + '&uid=' + uid + '&verify=' + verify + '&cid=' + cid
        $('#download').html('<a class=\"btn btn-primary\" href=\"/api/log/session/transcript.csv?' + download_params + '\">下载日志</a>')
    }

    function loadLog() {
        console.log("Sending Request...")

        $("#log-result-header").html('正在载入日志 <img src="../img/loading.gif" alt="loading" width="24" display="inline"/>');
        $.ajax({
            url: chat_api_domain + '/api/log/session',
            headers: {
                "appkey": appkey,
                "timestamp": timestamp,
                "uid": uid,
                "verify": verify,
                "cid": cid,
            },
            type: 'GET',
            success: ajaxOnSuccess,
            error: function () {
                $("#log-result-header").html('没有找到相关日志。')
                $('#log-alert-1').show();
                $('#log-alert-2').show();

            }
        });
    };

    function zeroFill(number, width) {
        width -= number.toString().length;
        if (width > 0) {
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + ""; // always return a string
    }


    loadLog();
});