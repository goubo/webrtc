var http = require('http')
    , express = require('express')
    , serveIndex = require('serve-index')
    , mqtt = require('mqtt')
var app = express();
app.use(serveIndex('./public/'))
app.use(express.static('./public/'))
http.createServer(app).listen(8081)

person = new Object();
person.firstname = "Bill";
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})


