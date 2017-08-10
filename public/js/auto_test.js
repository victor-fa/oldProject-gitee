var test_cases = []

var ask_counter = 0

function auto_ask() {
    if (ask_counter < test_cases.length) {
        setTimeout(function() {
            $('#progress').text((ask_counter+1) + ' / ' + test_cases.length)
            ask_question(test_cases[ask_counter++], auto_ask)
        }, 1000)
    }
}

function send_hello() {
    $('#app').text(appkey)
    ask_question('你好', auto_ask)
}