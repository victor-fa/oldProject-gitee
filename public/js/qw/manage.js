$().ready(function () {
    $('#qw-admin-tool').addClass('in');

    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matches) {
            var ret = obj[matches.replace(/\$/g, "")];
            if (ret === "") {
                ret = "N/A";
            }
            return (ret + "") === "undefined" ? matches : ret;
        });
    }

    function ajaxOnSuccess(obj) {
        console.log("Got Respond.");
        console.log(obj)
    }

    function active_user(id, active) {
        console.log("Sending Request...");
        $.ajax({
            url: '/admin/manage/api/active',
            body: {
                "id": id,
                "active": active
            },
            type: 'POST',
            success: ajaxOnSuccess,
            error: function () {
                alert('change user activation status failed')
            }
        });
    }

    // $('.active-btn > div').on('click', function () {
    //     console.log('hello')
    //     var id = $(this).attr('id')
    //     var activeStatus = $(this).attr('status-code') == 'active' ? true : false
    //     console.log('id:' + id + ' status:' + activeStatus)
    //     active_user(id, activeStatus);
    // });

    function loadAllUser() {
        console.log("Sending Request...");
        $.ajax({
            url: '/admin/manage/api/load',
            type: 'POST',
            success: loadAjaxOnSuccess,
            error: function () {
                alert('change user activation status failed')
            }
        });
    }

    function loadAjaxOnSuccess(obj) {
        console.log("Got Respond.");
        console.log(obj);
        var tempUserListHtml = $('#manage-list-result-temp').html();
        var resObj = {};
        for (var i = 0; i < obj.length; ++i) {
            resObj._id = obj[i]._id;
            resObj.username = obj[i].username;
            resObj.name = obj[i].name;
            resObj.phone = obj[i].phone;
            resObj.email = obj[i].email;
            resObj.active = obj[i].activation;
            resObj.group = obj[i].group;
            resObj.company = obj[i].company;
            resObj.wechat_openid = obj[i].wechat_openid;
            resObj.alertSms = obj[i].alertSms;
            resObj.alertEmail = obj[i].alertEmail;
            resObj.appkey = obj[i].appkey;
            resObj.appsecret = obj[i].appsecret;
            var resHtml = tempUserListHtml.temp(resObj);
            console.log(resHtml);
            $('#user-list-result').append(resHtml);
        }
    }

    loadAllUser();
});
