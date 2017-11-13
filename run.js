let express = require('express');
let app = express();
app.use('/',express.static(__dirname));
let port = 8001;
app.listen(port,function(){
    console.log(`server is running on ${port}`);
});
