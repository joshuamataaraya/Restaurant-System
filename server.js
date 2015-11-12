var express         =       require("express");
var app             =       express();
var bodyParser  = require('body-parser');
var server          =   app.listen(3000);
var sql = require('mssql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }

    });
});
var config = {
    user: 'restaurants',
    password: '1234',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'Restaurantes',

    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
}

//var connection = new sql.Connection(config, function(err) {

  // Query

  //  var request = new sql.Request(connection); // or: var request = connection.request();
  //  request.query('select * from Administradores', function(err, recordset) {
  //      // ... error checks
  //      console.log(err);
  //      console.dir(recordset);
   //
  //  });

    // Stored Procedure
    // console.log("Here1");
    // var request = new sql.Request(connection);
    // request.input('pIdUsuario', sql.Int, 1);
    // request.input('pNombre', sql.VarChar(50), "Joshuamataaaraya");
    // request.input('pApellido', sql.VarChar(50), "Mata");
    // request.input('pTelefono', sql.Numeric (8, 0), 88888888);
    // request.input('pCedula', sql.Numeric (9, 0), 999999999);
    // request.input('pContrasenna', sql.VarChar(sql.MAX), "12345");
    //
    // request.execute('sp_insertarAdministrador', function(err, recordsets, returnValue) {
    //     // ... error checks
    //     console.log(err);
    //     console.log("here 2");
    //     console.dir(recordsets);
    // });
// });
// connection.on('error', function(err) {
//     // ... error handler
//     console.log("Not connected to db");
// });


app.post('/signup', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdUsuario', sql.Int, 1);
        request.input('pNombre', sql.VarChar(50), req.body.name);
        request.input('pApellido', sql.VarChar(50), req.body.lastName);
        request.input('pTelefono', sql.Numeric (8, 0), req.body.telphone);
        request.input('pCedula', sql.Numeric (9, 0), req.body.id);
        request.input('pContrasenna', sql.VarChar(sql.MAX), req.body.password);

        request.execute('sp_insertarCliente', function(err, recordsets, returnValue) {
            // ... error checks
            console.log(err);
            console.log("here 2");
            console.dir(recordsets);
        });
    });
    connection.on('error', function(err) {console.log("Not connected to db");});
    res.end();
});
app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});
