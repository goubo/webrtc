var http=require('http'),express = require('express'),serveIndex = require('serve-index')

var app = express();
app.use(serveIndex('./public/index.html'))
app.use(express.static('./public'))

http.createServer(app).listen(8081)