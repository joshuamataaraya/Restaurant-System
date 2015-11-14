var express         =       require("express");
var app             =       express();
var multer          =       require('multer');
var upload          =       multer({ dest: './app/img/Ingredients'});
var bodyParser      =       require('body-parser');
var sql             =       require('mssql');
var Cookies         =       require( "cookies" );
var cookieParser    =       require('cookie-parser');
var done=false;
var server          =       app.listen(3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(cookieParser())

app.use(multer({ dest: './app/img/Ingredients',
    rename: function (fieldname, filename) {
        return filename;
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    }
}));

//this is the db configuration for connection
var config = {
    user: 'restaurants',
    password: '1234',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'Restaurantes'
}

//this is to upload pictures
app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
    });
});
//this is to upload pictures
app.post('/login',function(req,res){
  var connection = new sql.Connection(config, function(err) {
      var request = new sql.Request(connection);
      request.input('pNombre', sql.VarChar(50), req.body.name);
      request.input('pContrasenna', sql.VarChar(sql.MAX), req.body.password);
      console.log('Name= '+ req.body.name);
      console.log('Pass= '+ req.body.password);
      request.execute('sp_checkLogin', function(err, recordsets, returnValue) {
          // ... error checks
          console.log("EROR:");
          console.log(err);
          console.log("RECORDSETS:");
          console.dir(recordsets);
          res.json(recordsets);
      });
  });
  connection.on('error', function(err) {console.log(err);});
});
//this is to create new client
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
            console.log("EROR:");
            console.log(err);
            console.log("RECORDSETS:");
            console.dir(recordsets);
        });
    });
    connection.on('error', function(err) {console.log(err);});
    res.end();
});
app.post('/client', function(req, res) {
  console.log('ID:');
    console.log(req.body.dbid);
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdCliente', sql.Int, req.body.dbid)
        request.execute('sp_consultarCliente', function(err, recordsets, returnValue) {
            // ... error checks
            console.log("EROR:");
            console.log(err);
            console.log("RECORDSETS:");
            console.dir(recordsets);
            res.json(recordsets);
        });
    });
    connection.on('error', function(err) {console.log(err);});
    //res.end();
});
app.post('/updateClient', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdUsuario', sql.Int, 1);
        request.input('pIdCliente', sql.Int, req.body.dbid);
        request.input('pNombre', sql.VarChar(50), req.body.name);
        request.input('pApellido', sql.VarChar(50), req.body.lastName);
        request.input('pTelefono', sql.Numeric (8, 0), req.body.telphone);
        request.input('pCedula', sql.Numeric (9, 0), req.body.id);
        request.input('pContrasenna', sql.VarChar(sql.MAX), req.body.password);

        request.execute('sp_modificarCliente', function(err, recordsets, returnValue) {
            // ... error checks
            console.log("EROR:");
            console.log(err);
            console.log("RECORDSETS:");
            console.dir(recordsets);
        });
    });
    connection.on('error', function(err) {console.log(err);});
    res.end();
});

app.post('/deleteClient', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdUsuario', 1);
        request.input('pIdCliente', sql.Int, req.body.dbid);
        
        request.execute('sp_eliminarCliente', function(err, recordsets, returnValue) {
            // ... error checks
            console.log("EROR:");
            console.log(err);
            console.log("RECORDSETS:");
            console.dir(recordsets);
        });
    });
    connection.on('error', function(err) {console.log(err);});
    res.end();
});

app.get('/',function(req,res){
    res.sendFile(__dirname + "/index.html");
});
