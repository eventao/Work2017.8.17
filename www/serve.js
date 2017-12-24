var express = require('express');
var app = express();
app.use('/',express.static(__dirname));
var port = 8012;
app.listen(port,function(){
    console.log('server runing on ' + port);
});