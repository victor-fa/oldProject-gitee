/**
 * Created by yzhang on 7/20/17.
 */
/**
 * Created by yzhang on 7/9/17.
 */

$().ready(function () {
    var appkey = "wechat";
    var appsecret = "123456";
    var size = 10;
    var sizeOld = size;

    var timestamp = Math.floor(Date.now() / 1000);
    var uid = "WhoIsLittleFeli";

    var search = location.search
    if (search) {
        uid = getParameterByName('uid')
        cid = getParameterByName('cid')
    }

    var timeReq = -1;
    var timeNext = timeReq;
    var timePrev = timeReq;
    var pageNum = 1;
    var verify = md5(appsecret + uid + timestamp);

    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matches) {
            var ret = obj[matches.replace(/\$/g, "")];
            if (ret === "") {
                ret = "N/A";
            }
            return (ret + "") === "undefined" ? matches : ret;
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
        return year + '-' + month + '-' + dates + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    function ajaxOnSuccess(obj) {
        console.log("Got Respond.");
        var sessions = obj.sessions;
        if (sessions.length === 0) {
            $("#log-result-context").html('<li class="list-group-item">没有找到相关日志列表。</li>')
            console.log("没有找到相关日志列表");
            return;
        }
        $("#log-result-header").html("第" + pageNum + "页，总计" + sessions.length + "条日志列表");
        $("#log-result-context").html("");
        var tempListHtmlAsk = $('#log-list-result').html()
        var resObj = {};
        var width = Math.ceil(Math.log10(sessions.length));
        timePrev = sessions[0].timestamp;
        for (var i = 0; i < sessions.length; ++i) {
            if (i === sessions.length - 1) {
                timeNext = sessions[i].timestamp - 1;
            }
            resObj.id = zeroFill(i + 1, width);
            resObj.timestamp = parseDateTime(sessions[i].timestamp);
            resObj.app = sessions[i].app;
            resObj.nickname = (sessions[i].nickname).trim();
            resObj.uid = sessions[i].uid;
            resObj.cid = sessions[i].cid;
            var resHtml = tempListHtmlAsk.temp(resObj);
            $("#log-result-context").append(resHtml);

        }
        if(pageNum > 1) {
            $("#log-prev-page").removeAttr("disabled");
        } else {
            $("#log-prev-page").attr("disabled", "disabled");
        }
        if(sessions.length == size) {
            $("#log-next-page").removeAttr("disabled");
        } else {
            $("#log-next-page").attr("disabled", "disabled");
        }
        addItemBg();
        console.log("timeReq:  " + timeReq);
        console.log("timePrev: " + timePrev);
        console.log("timeNext: " + timeNext);
    }

    function zeroFill(number, width) {
        width -= number.toString().length;
        if (width > 0) {
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number + ""; // always return a string
    }

    function loadLogList() {
        console.log("Sending Request...");

        $("#log-result-header").html("正在载入日志列表……");
        if (timeReq <= 0) {
            console.log("============ no time")
            $.ajax({
                url: 'https://robot-service.centaurstech.com/api/log/list',
                headers: {
                    "appkey": appkey,
                    "timestamp": timestamp,
                    "uid": uid,
                    "verify": verify,
                    "size": size
                },
                type: 'GET',
                success: ajaxOnSuccess,
                error: function () {
                    $("#log-result-header").html('没有找到相关日志列表。')
                    $('#log-alert-1').show();
                    $('#log-alert-2').show();
                }
            });
        } else {
            console.log("============ has time")
            $.ajax({
                url: 'https://robot-service.centaurstech.com/api/log/list',
                headers: {
                    "appkey": appkey,
                    "timestamp": timestamp,
                    "uid": uid,
                    "verify": verify,
                    "time": timeReq,
                    "size": size
                },
                type: 'GET',
                success: ajaxOnSuccess,
                error: function () {
                    $("#log-result-header").html('没有找到相关日志列表。')
                    $('#log-alert-1').show();
                    $('#log-alert-2').show();
                }
            });
        }
    };

    // add the background colors of items
    function addItemBg() {
        for (var i = 0; i < size; i++) {
            if (i % 2 === 1) {
                var selector = '.list-group-item:nth-child(' + i + ')';
                $(selector).css('background-color', '#f9f9f9');
            }
        }
    }

    function buttonsHandler() {
        $("#log-search").click(function () {
            timeReq = -1;
            pageNum = 1;
            loadLogList();
        });
        $("#log-first-page").click(function () {
            timeReq = -1;
            pageNum = 1;
            loadLogList();
        });
        $("#log-prev-page").click(function () {
            if (pageNum <= 1) {
                $("#log-prev-page").attr("disabled", "disabled");
            }
            loadLogList();
        });
        $("#log-next-page").click(function () {
            timeReq = timeNext;
            pageNum += 1;
            loadLogList();
        });

        $( "#page-size" ).change(function() {
            size = $("#page-size option:selected").text();
            $("#log-prev-page").attr("disabled", "disabled");
            $("#log-next-page").attr("disabled", "disabled");
        });
    }

    loadLogList();
    buttonsHandler();
});