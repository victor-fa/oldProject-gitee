var bot_endpoint = 'https://robot-service.centaurstech.com/api/chat'

function on_send_question(ask) {
    console.log('user ask: ' + ask)
}

function on_receive_answer(reply) {
    console.log('robot answer: ' + reply)
}

function ask_question(msg, callback) {
    on_send_question(msg)

    var fd = new FormData()
    fd.append('appkey', appkey)
    var now = Date.now()
    fd.append('timestamp', now)
    fd.append('uid', uid)
    var hash = md5(appsecret + uid + now)
    fd.append('verify', hash)
    fd.append('msg', msg)
    fd.append('nickname', nickname)

    $.ajax({
        url: bot_endpoint,
        type: "POST",
        data: fd,
        processData: false,
        contentType: false,
        success: function(data, status) {
            if (data.msg != "") {
                on_receive_answer(data.msg)

                if (typeof callback == "function") {
                    callback()
                }
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log("Status: " + xhr.status)
            console.log(thrownError)

        },
    })
}