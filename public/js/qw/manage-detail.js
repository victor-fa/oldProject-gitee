$().ready(function () {
    $('#qw-admin-tool').addClass('in');

    $('.user-app-list-item-remove a').each(function () {
        var href = $(this).attr('href')+'&id='+$('#user-id').html()
        $(this).attr('href', href);
        console.log(href);
    });

    function activateAjaxOnSuccess(obj) {
        console.log("Got Respond.");
        location.reload();
    }

    function activateUser(id, activate) {
        console.log("Sending Request...");
        // console.log(`id: ${id} \tactivate: ${activate}`);
        $.ajax({
            url: '/admin/manage/api/activate',
            type: 'POST',
            data: {
                "id": id,
                "activate": activate
            },
            success: activateAjaxOnSuccess,
            error: function () {
                // err alert
            }
        });
    }

    $(document).on('click', '.btn-active-status', function () {
        console.log('hello');
        var id = $(this).attr('id');
        var activateStatus = $(this).attr('status-code');
        console.log('id:' + id + ' status:' + activateStatus);
        activateUser(id, activateStatus);
    });

    
});
