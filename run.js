let express = require('express');


let router = express.Router();
require('./routers/main-router')(router);


let app = express();
app.use('/',express.static(__dirname));
app.use('/', router);

let port = 8008;
app.listen(port,() => {
    console.log(`server is running on ${port}`);
});