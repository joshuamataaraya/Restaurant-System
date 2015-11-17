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
    user: 'admin',
    password: '12345678',
    server: '192.168.0.107', // You can use 'localhost\\instance' to connect to named instance
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

app.post('/addIngredient', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdUsuario', sql.Int, req.body.user);
        request.input('pIdRestaurante', sql.Int, req.body.restaurant);
        request.input('pNombre', sql.VarChar(50), req.body.name);
        request.input('pPrecio', sql.Money, req.body.price);
        request.input('pCantidad', sql.Int, req.body.quantity);
        request.input('pFoto', sql.VarChar(sql.MAX), req.body.url);


        request.execute('sp_insertarIngrediente', function(err, recordsets, returnValue) {
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
app.post('/getRestaurants', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.execute('sp_consultarRestaurantes', function(err, recordsets, returnValue) {
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

app.post('/getInventory', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdRestaurante', sql.Int, req.body.id);
        request.execute('sp_consultarIngredientes', function(err, recordsets, returnValue) {
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

app.post('/getMenu', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdRestaurante', sql.Int, req.body.id);
        request.execute('sp_consultarMenuRestaurante', function(err, recordsets, returnValue) {
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

app.post('/getIngredients', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdPlatillo', sql.Int, req.body.id);
        request.execute('sp_consultarIngredientesPlatillo', function(err, recordsets, returnValue) {
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

app.post('/getAllIngredients', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.execute('sp_consultarIngredientes', function(err, recordsets, returnValue) {
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

app.post('/saveChanges', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdUsuario', sql.Int, req.body.user);
        request.input('pIdIngrediente', sql.Int, req.body.id  );
        request.input('pIdRestaurante', sql.Int, req.body.idRest);
        request.input('pNombre', sql.VarChar(50), req.body.name);
        request.input('pCantidad', sql.Int, req.body.quantity);
        request.input('pPrecio', sql.Money, req.body.price);
        request.input('pFoto', sql.VarChar(sql.MAX), req.body.url);


        request.execute('sp_modificarIngrediente', function(err, recordsets, returnValue) {
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

app.post('/insertOrder', function(req, res) {
  console.log('Body add dish:');
  console.dir(req.body);
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pMetodoPago', sql.VarChar(50), req.body.payMethod);
        request.input('IdCliente', sql.Int, req.body.idClient);
        request.execute('sp_insertarOrden', function(err, recordsets, returnValue) {
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


app.post('/getClients', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.execute('sp_consultarClientes', function(err, recordsets, returnValue) {
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

app.post('/addDishInOrder', function(req, res) {
  console.log('Body add dish:');
  console.dir(req.body);
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdOrden', sql.Int, req.body.idOrder);
        request.input('pIdPlatillo', sql.Int, req.body.idDish);
        request.input('pCantidad', sql.Int, req.body.quantity);
        request.execute('sp_insertarPlatoOrden', function(err, recordsets, returnValue) {
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
app.post('/endOrder', function(req, res) {
  console.log('Body end order:');
  console.dir(req.body);
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdUsuario', sql.Int, req.body.idUser);
        request.input('pIdOrden', sql.Int, req.body.idOrder);
        request.execute('sp_finalizarOrden', function(err, recordsets, returnValue) {
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

app.post('/addRestaurant', function(req, res) {
  console.log(req.body.name);
  console.log(req.body.schedule);
  console.log(req.body.cuadra);
  console.log(req.body.category);
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pNombre', sql.VarChar(50), req.body.name);
        request.input('pHorario', sql.VarChar(50), req.body.schedule);
        request.input('pCategoria', sql.Int, req.body.category);
        request.input('pCuadra', sql.Int, req.body.cuadra);
        request.execute('sp_insertarRestaurante', function(err, recordsets, returnValue) {
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
app.post('/getCuadras', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.execute('sp_consultarCuadras', function(err, recordsets, returnValue) {
            // ... error checks
            console.dir(recordsets);
            res.json(recordsets);
        });
    });
    connection.on('error', function(err) {console.log(err);});
});

app.post('/getCategories', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.execute('sp_consultarCategorias', function(err, recordsets, returnValue) {
            // ... error checks
            console.dir(recordsets);
            res.json(recordsets);
        });
    });
    connection.on('error', function(err) {console.log(err);});
});

app.post('/incomes', function(req, res) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdRestaurante', sql.Int, req.body.idRest);
        request.input('pFecha', sql.Date, req.body.date);
        request.execute('sp_consultarGanancias', function(err, recordsets, returnValue) {
            // ... error checks
            console.dir(recordsets);
            res.json(recordsets);
        });
    });
    connection.on('error', function(err) {console.log(err);});
});

app.post('/ingredientSales', function(req, res) {
  console.log("SALES");
  console.dir(req.body);
  console.log(req.body.idUser);
  console.log(req.body.idIngre);
  console.log(req.body.idRest);
  console.log(req.body.date);
  console.log(req.body.date2);

    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdUsuario', sql.Int, req.body.idUser);
        request.input('pIdIngrediente', sql.Int, req.body.idIngre);
        request.input('pIdRestaurante', sql.Int, req.body.idRest);
        request.input('pFechaInicio', sql.Date, req.body.date);
        request.input('pFechaFinal', sql.Date, req.body.date2);
        request.execute('sp_consultarVentasIngrediente', function(err, recordsets, returnValue) {
            // ... error checks
            console.dir(recordsets);
            res.json(recordsets);
        });
    });
    connection.on('error', function(err) {console.log(err);});
});

app.post('/allIncomes', function(req, res) {

    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pFechaInicio', sql.Date, req.body.date);
        request.input('pFechaFinal', sql.Date, req.body.date2);
        request.execute('sp_consultarVentasTotales', function(err, recordsets, returnValue) {
            // ... error checks
            console.dir(recordsets);
            res.json(recordsets);
        });
    });
    connection.on('error', function(err) {console.log(err);});
});

app.post('/weeklySales', function(req, res) {

    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdRestaurante', sql.Int, req.body.idRest);
        request.input('pFechaInicio', sql.Date, req.body.date);
        request.input('pFechaFinal', sql.Date, req.body.date2);
        request.execute('sp_consultarVentasSemana', function(err, recordsets, returnValue) {
            // ... error checks
            console.dir(recordsets);
            res.json(recordsets);
        });
    });
    connection.on('error', function(err) {console.log(err);});
});


app.post('/deleteIngredient', function(req, res) {

    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('pIdUsuario', sql.Int, req.body.user);
        request.input('pIdIngrediente', sql.Int, req.body.ingredient);
        request.execute('sp_eliminarIngrediente', function(err, recordsets, returnValue) {
            // ... error checks
            console.dir(recordsets);
        });
    });
    connection.on('error', function(err) {console.log(err);});
    res.end();
});

app.get('/',function(req,res){
    res.sendFile(__dirname + "/index.html");
});
