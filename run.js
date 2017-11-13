let express = require('express');
let app = express();
app.use('/',express.static(__dirname));
let port = 8008;
app.listen(port,() => {
    console.log(`server is running on ${port}`);
});