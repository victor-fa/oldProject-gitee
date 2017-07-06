var express = require("express")
var app = express()

var port = process.env.PORT || 10001
app.set('port', port)

app.listen(app.get('port'), function() {
    console.log('Server started at ' + port)
})