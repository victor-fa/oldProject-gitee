$().ready(function () {
    var appkey = $('#appkey').html();
    var appsecret = $('#appsecret').html();
    var username = $('#username').html();
    var timestamp = Math.floor(Date.now() / 1000);

    var verify = md5(appsecret + username + timestamp);

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
        console.log("Got Response.:\n" + JSON.stringify(obj, null, 4));
        obj = obj.msg

        var satisfaction = obj.satisfaction;
        var solved = obj.solved;
        var peak = obj.peak;
        var questions = obj.questions;
        var sessions = obj.sessions;
        var session_time = obj.session_time;
        var knowledge_base = obj.knowledge_base;
        var manual = obj.manual;
        var question_time = obj.question_time;
        var users = obj.users;

        /*
        // Test data
        var satisfaction = 1;
        var solved = 1;
        var peak = 1;
        var questions = 2;
        var sessions = 1;
        var session_time = 40.15987618;
        var knowledge_base = 1;
        var manual = 0;
        var question_time = 4.89745156;
        var users = 1;
        */
        
        // Panels
        $('#dash-question').html(questions);
        $('#dash-peak').html(Math.round(questions/sessions*100)/100);
        $('#dash-users').html(users);
        $('#dash-sessions').html(sessions);

        // progress-bar
        var satiPercent = intToPercentage(satisfaction);
        $('#dash-satisfaction').html(satiPercent + '%');
        $('#dash-satisfaction').attr('aria-valuenow', satiPercent);
        if (satiPercent > 5) {
            $('#dash-satisfaction').css('width', satiPercent + '%');
        }

        var solvedPercent = intToPercentage(solved);
        $('#dash-solved').html(solvedPercent + '%');
        $('#dash-solved').attr('aria-valuenow', solvedPercent);
        if (solvedPercent > 5) {
            $('#dash-solved').css('width', solvedPercent + '%');
        }

        var knowledgePercent = intToPercentage(knowledge_base);
        $('#dash-k-base').html(knowledgePercent + '%');
        $('#dash-k-base').attr('aria-valuenow', knowledgePercent);
        if (knowledgePercent > 5) {
            $('#dash-k-base').css('width', knowledgePercent + '%');
        }

        var manualPercent = intToPercentage(manual);
        $('#dash-manual').html(manualPercent + '%');
        $('#dash-manual').attr('aria-valuenow', manualPercent);
        if (manualPercent > 5) {
            $('#dash-manual').css('width', manualPercent + '%');
        }

        // clock
        $('#dash-question-time').html(Math.round(question_time*100)/100);
        $('#dash-session-time').html(Math.round(session_time*100)/100);
    }

    function loadStatics() {
        console.log("Sending Request...");
        console.log(appkey);
        console.log(timestamp);
        console.log(username);
        console.log(verify);

        $.ajax({
            url: 'https://robot-service.centaurstech.com/api/statics',
            data: {
                "appkey": appkey,
                "timestamp": timestamp,
                "username": username,
                "verify": verify,
            },
            type: 'POST',
            success: ajaxOnSuccess,
            error: function () {
                //    
            }
        });
    }

    function intToPercentage(num) {
        if (num > 1) num = 1;
        if (num < 0) num = 0;
        return Math.floor(num * 100);
    }

    loadStatics();
});