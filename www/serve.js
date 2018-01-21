let express = require('express');
let app = express();
app.use('/',express.static(__dirname));
let port = 8013;
app.listen(port,function(){
    console.log('server runing on ' + port);
});
