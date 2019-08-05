var bot_endpoint = 'https://robot-service.centaurstech.com/api/chat';

function on_send_question(ask) {
    console.log('user ask: ' + ask)
}

function on_receive_answer(reply) {
    console.log('robot answer: ' + reply)
}

function on_recieve_data(data) {
    console.log('Extra data:\n' + JSON.stringify(data))
}

function on_receive_error(statusCode){
    alert("信息输入错误！服务器返回代码:" + statusCode)
}
function ask_question(msg, callback) {
    on_send_question(msg)

    if (msg.length <= 0) {
        if (typeof callback == "function") {
                    callback()
        }
    }

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

                if (typeof data.data != "undefined")
                    on_recieve_data(data.data)

                if (typeof callback == "function") {
                    callback()
                }
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log("Status: " + xhr.status)
            console.log(thrownError)
            on_receive_error(xhr.status)

        },
    })
}