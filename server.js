var express         =       require("express");
var app             =       express();
var server          =   app.listen(3000);



app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname));

app.post('/',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }

    });
});
