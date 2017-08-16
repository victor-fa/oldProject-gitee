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
        loadAllUser();
    }

    function active_user(id, active) {
        console.log("Sending Request...");
        console.log(`id: ${id} \tactive: ${active}`);
        $.ajax({
            url: '/admin/manage/api/active',
            type: 'POST',
            body: {
                "id": id,
                "active": active
            },
            success: ajaxOnSuccess,
            error: function () {
                alert('change user activation status failed')
            }
        });
    }

    function loadAllUser() {
        console.log("Sending Request...");
        $.ajax({
            url: '/admin/manage/api/load',
            type: 'GET',
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
            resObj.statusCode = obj[i].activation;
            if (obj[i].activation === 1) {
                resObj.active = "已激活";
                resObj.buttonType = 'success';
            } else {
                resObj.active = "未激活";
                resObj.buttonType = 'danger';
            }
            resObj.group = obj[i].group;
            resObj.company = obj[i].company;
            resObj.wechat_openid = obj[i].wechat_openid;
            resObj.alertSms = obj[i].alertSms;
            resObj.alertEmail = obj[i].alertEmail;
            resObj.appkey = obj[i].appkey;
            resObj.appsecret = obj[i].appsecret;
            var resHtml = tempUserListHtml.temp(resObj);
            $('#user-list-result').append(resHtml);
        }
    }

    loadAllUser();

    $(document).on('click', '.btn-active-status', function () {
        console.log('hello');
        var id = $(this).attr('id');
        var activeStatus = $(this).attr('status-code');
        console.log('id:' + id + ' status:' + activeStatus);
        active_user(id, activeStatus);
    });
});
