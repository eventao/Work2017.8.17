let fs = require('fs');

module.exports = function(router){

    router.get('/model/:name',(req,res) => {
        let name = req.params.name;
        if(name){
            let assetsPath = `./assets/d3-models/${name}`;
            fs.readFile(assetsPath,'utf-8', function(err,data){
                res.send(data);
            });
        }else{
            res.json({});
        }
    });
};