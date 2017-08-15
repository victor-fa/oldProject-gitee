$().ready(function () {

    function ajaxOnSuccess(obj) {
        console.log("Got Respond.");
        console.log(obj)
    }

    function active_user(id, active) {
        console.log("Sending Request...");
        $.ajax({
            url: '/users/auth',
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

    $('.active-btn > div').on('click', function () {
        console.log('hello')
        var id = $(this).attr('id')
        var activeStatus = $(this).attr('status-code') == 'active' ? true : false
        console.log('id:' + id + ' status:' + activeStatus)
        active_user(id, activeStatus);
    });
});
