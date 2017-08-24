$().ready(function () {
    $('#qw-admin-tool').addClass('in');

    $('.user-app-list-item-remove a').each(function () {
        var href = $(this).attr('href')+'&id='+$('#user-id').html()
        $(this).attr('href', href);
        console.log(href);
    });
});
