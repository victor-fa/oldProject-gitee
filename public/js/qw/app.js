$().ready(function () {
    function switchCurrApp(id, appkey, appsecret) {
        console.log("Sending Request...");
        console.log(`id: ${id} \tappkey: ${appkey} \tappsecret: ${appsecret}`);
        $.ajax({
            url: '/users/app/api/link',
            type: 'POST',
            data: {
                "id": id,
                "appkey": appkey,
                "appsecret": appsecret
            },
            success: switchCurrAppOnSuccess,
            error: function () {
                alert('switch current app failed');
            }
        });
    }

    function switchCurrAppOnSuccess(obj) {
        console.log("Got Respond.");
        console.log(obj);
        location.reload();
    }

    $(document).on('click', '.app-list-item', function () {
        var id = $('#user-id').html();
        var appkey = $(this).attr('appkey');
        var appsecret = $(this).attr('appsecret');
        console.log(`id: ${id} \tappkey: ${appkey} appsecret: ${appsecret}`);
        switchCurrApp(id, appkey, appsecret);
    });
});
