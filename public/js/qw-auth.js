$().ready(function () {

    function ajaxOnSuccess(obj) {
        console.log("Got Respond.");

    }

    function activeUser(id, active) {
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
            }
        });
    }

    $('.qw-inactive').click(function (e) {
        console.log(e)
        var id = $(this).attr('id');
        var activeStatus = id.substr(id.length - 2, id.length - 1);
        id = id.substr(0, id.length - 2);
        activeUser(id, activeStatus);
    });
});
