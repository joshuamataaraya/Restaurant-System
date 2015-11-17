'use strict';

/* Controllers */
var restaurantSystem = angular.module('restaurantsControllers', []);

restaurantSystem.controller('signinCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
  $scope.signin=function(){
    $http.post('/login', $scope.client)
    .then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.dir(response.data[0][0]);
        var Id=response.data[0][0].Id;
        var Tipo=response.data[0][0].Tipo;
        if(Id==-1){
          $scope.wrong=true;
          $cookies.put('login','');
        }else{
          if(Tipo=='admin'){
            $cookies.put('login','Admin');
          }else{
            $cookies.put('login','Client');
          }
          $cookies.put('userId',Id.toString());
          $location.path('/')
        }
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert('error on storage')
      });
  }
});
restaurantSystem.controller('signupCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
  $scope.newClient=function(){
    alert("begin");
    $http.post('/signup', $scope.client)
    .then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        $location.path('/');
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert('It wasn\'t posible to create this user')
        $location.path('/');
      });
  }
});
restaurantSystem.controller('clientDetailsCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
  //delete the user
  //modify the data
  //request to all the data and initialize it
  $scope.client={}
  $scope.client.dbid=$rootScope.id;
  console.log($scope.client.dbid);
  $http.post('/client', $scope.client)
  .then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.dir(response);
      if(response.data[0][0].length!=0){
        $scope.client.name=data(response).Nombre;
        $scope.client.lastName=data(response).Apellido;
        $scope.client.id=data(response).Cedula;
        $scope.client.telphone=data(response).Telefono;
        $scope.client.dbid=data(response).Id;
      }
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      alert('error on storage')
    });

  $scope.saveChanges=function(){
    $http.post('/updateClient', $scope.client)
    .then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        $location.path('/');
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert('error on storage')
      });
  }
  $scope.deleteUser=function(){
    alert($scope.client.dbid)
    $http.post('/deleteClient', $scope.client)
    .then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        $location.path('/logout');
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert('error on storage')
      });
  }
});
restaurantSystem.controller('addIngredientCtrl', function ($scope, $http,$rootScope,$location,$cookies) {

  $scope.restaurants=[];
  //get every restaurants
  $http.post('/getRestaurants')
  .then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.dir(response);
      if(response.data[0].length!=0){
        var i;
        for(i=0;i<response.data[0].length;i++){
          var restAux={};
          restAux.id=response.data[0][i].Id;
          restAux.name=response.data[0][i].Nombre;
          restAux.category=response.data[0][i].Categoria;
          restAux.isSelected=false;
          $scope.restaurants.push(restAux);
        }
      }
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      alert('error on storage')
    });


  $scope.add=function(){
    var fileVal=document.getElementById("abc");
    if(fileVal != undefined){
      var finalstr;
      var res = fileVal.value.slice(12);
      finalstr = "app/img/Ingredients/" + res; //this is the url to store in the db
      $scope.ingredient.url=finalstr;
      var form=document.getElementById("uploadForm");
      form.submit();
    }

    $scope.ingredient.user = $rootScope.id;
    var i;
    for(i=0;i<$scope.restaurants.length;i++){
      if ($scope.restaurants[i].isSelected==true){
        $scope.ingredient.restaurant=$scope.restaurants[i].id;
        $http.post('/addIngredient', $scope.ingredient)
        .then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            alert("Ingredient added!!")
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('error on storage')
          });
      }
    }
    $location.path('/');
  }
});
restaurantSystem.controller('ingredientDetailsCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
  //show and change the amount of that ingredient
});
restaurantSystem.controller('viewRestaurantCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
  $scope.restaurants=[];
  $scope.ingredients=[];
  $scope.dishes=[];
  //get every restaurants
  $http.post('/getRestaurants')
  .then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.dir(response);
      if(response.data[0].length!=0){
        var i;
        for(i=0;i<response.data[0].length;i++){
          var restAux={};
          restAux.id=response.data[0][i].Id;
          restAux.name=response.data[0][i].Nombre;
          restAux.category=response.data[0][i].Categoria;
          restAux.schedule=response.data[0][i].Horario
          $scope.restaurants.push(restAux);
        }
      }
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      alert('error on storage')
    });
    $scope.toShow='restaurants';

    $scope.viewMenu=function(rest){
      $http.post('/getMenu',rest)
      .then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.dir(response);
          if(response.data[0].length!=0){
            var i;
            $scope.dishes=[];
            for(i=0;i<response.data[0].length;i++){
              var dishAux={};
              dishAux.id=response.data[0][i].Id;
              dishAux.name=response.data[0][i].Nombre;
              $scope.dishes.push(dishAux);
            }
          }
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert('error on storage')
        });
        $scope.toShow='dish';
    }

    $scope.viewIngredients=function(dish){
      $http.post('/getIngredients',dish)
      .then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.dir(response);
          if(response.data[0].length!=0){
            var i;
            $scope.ingredients=[];
            for(i=0;i<response.data[0].length;i++){
              var ingredientAux={};
              ingredientAux.id=response.data[0][i].Id;
              ingredientAux.name=response.data[0][i].Nombre;
              ingredientAux.url=response.data[0][i].Foto;

              $scope.ingredients.push(ingredientAux);
            }
          }
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert('error on storage')
        });
        $scope.toShow='ingredient';
    }


    $scope.viewInventory=function(rest){
      $http.post('/getInventory',rest)
      .then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.dir(response);
          if(response.data[0].length!=0){
            var i;
            $scope.ingredients=[];
            for(i=0;i<response.data[0].length;i++){
              var ingredientAux={};
              ingredientAux.idRest=rest.id;
              ingredientAux.id=response.data[0][i].Id;
              ingredientAux.name=response.data[0][i].Nombre;
              ingredientAux.price=response.data[0][i].Precio;
              ingredientAux.quantity=response.data[0][i].Cantidad;
              ingredientAux.url=response.data[0][i].Foto;
              $scope.ingredients.push(ingredientAux);
            }
          }
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert('error on storage')
        });
        $scope.toShow='inventory';
    }

    $scope.saveChange=function(ingredient){
      var fileVal=document.getElementById("abc");
      if(fileVal != undefined){
        var finalstr;
        var res = fileVal.value.slice(12);
        finalstr = "app/img/Ingredients/" + res; //this is the url to store in the db
        ingredient.url=finalstr;
        var form=document.getElementById(ingredient.id);
        form.submit();
        alert('Subido')
      }else{
        ingredient.url=undefined;
      }

      ingredient.user=$rootScope.id;
      $http.post('/saveChanges', ingredient)
      .then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          alert("Changes saved!!")
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert('error on storage')
        });

    }
    $scope.delete=function(ingredient){
      var data={};
      data.user=$rootScope.id;
      data.ingredient=ingredient.id;
      console.dir(data);
      $http.post('/deleteIngredient',data)
      .then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.dir(response);
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert('error on storage')
        });
        $location.path('/')
    }

    $scope.info={};
    $scope.newBilling=function(rest){
      $http.post('/getMenu',rest)
      .then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.dir(response);
          if(response.data[0].length!=0){
            var i;
            $scope.dishes=[];
            for(i=0;i<response.data[0].length;i++){
              var dishAux={};
              dishAux.id=response.data[0][i].Id;
              dishAux.name=response.data[0][i].Nombre;
              dishAux.quantity=0;
              $scope.dishes.push(dishAux);
            }
          }
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert('error on storage')
        });
        $scope.toShow='bill';

        $http.post('/getClients')
        .then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.dir(response);
            if(response.data[0].length!=0){
              var i;
              $scope.clients=[];
              for(i=0;i<response.data[0].length;i++){
                var client={};
                client.dbid=response.data[0][i].Id;
                client.name=response.data[0][i].Nombre;
                client.lastName=response.data[0][i].Apellido;
                client.telephone=response.data[0][i].Telefono;
                client.id=response.data[0][i].Cedula;
                $scope.clients.push(client);
              }
            }
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('error on storage')
          });
    }
    $scope.inc=function(obj){
      obj.quantity++;
    }
    $scope.dec=function(obj){
      if(obj.quantity>0){
        obj.quantity--;
      }
    }
    $scope.bill=function(){
      var orderNumber;
      console.dir($scope.info);
      $http.post('/insertOrder',$scope.info)
      .then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.dir(response);
          if(response.data[0].length!=0){
            var i;
            for(i=0;i<response.data[0].length;i++){
               orderNumber=response.data[0][i].NumeroOrden;
            }
          }
          var i;
           for(i=0;i<$scope.dishes.length;i++){
             if($scope.dishes[i].quantity>0){
               var info={};
               info.idOrder=orderNumber;
               info.idDish=$scope.dishes[i].id;
               info.quantity=$scope.dishes[i].quantity;
               $http.post('/addDishInOrder',info)
               .then(function successCallback(response) {
                   // this callback will be called asynchronously
                   // when the response is available
                   console.dir(response);
                 }, function errorCallback(response) {
                   // called asynchronously if an error occurs
                   // or server returns response with an error status.
                   alert('error on storage')
                 });
             }
           }
           $scope.info.idUser=$rootScope.id;
           $scope.info.idOrder=orderNumber;
           $http.post('/endOrder',$scope.info)
           .then(function successCallback(response) {
               // this callback will be called asynchronously
               // when the response is available
               console.dir(response);
             }, function errorCallback(response) {
               // called asynchronously if an error occurs
               // or server returns response with an error status.
               alert('error on storage')
             });
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert('error on storage')
        });
     }

});
restaurantSystem.controller('newRestaurantCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
  $http.post('/getCuadras')
  .then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.dir(response);
      if(response.data[0].length != 0){
        var i;
        for(i=0;i<response.data[0].length;i++){
          var select = document.getElementById("selectCuadra");
          var option = document.createElement("option");
          option.text = "Cuadra "+response.data[0][i].Id;
          option.value = response.data[0][i].Id;
          select.add(option);
        }
      }
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      alert('error on storage')
    });
    $http.post('/getCategories')
    .then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.dir(response);
        if(response.data[0].length != 0){
          var i;
          for(i=0;i<response.data[0].length;i++){
            var select = document.getElementById("selectCategory");
            var option = document.createElement("option");
            option.text = response.data[0][i].Nombre;
            option.value = response.data[0][i].Id;
            select.add(option);
          }
        }
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert('error on storage')
      });
      $scope.saveRestaurant=function(){
        $http.post('/addRestaurant', $scope.rest)
        .then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            $location.path('/');
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('error on storage')
          });
      }
  });
  restaurantSystem.controller('reportCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
    //1. Ver ventas y la ganancia de restaurantes en un día en específico.

    // 2. Generar una consulta en donde se ingrese un ingrediente en específico y muestre
    // todas las ventas realizadas de platillos en donde se encuentre ese ingrediente,
    //  a esta consulta se le puede enviar como parámetro el restaurante o un rango de fechas.
    //   Estos parámetros pueden ser opcionales.

    // 3. Generar consulta en donde se pueda ver una comparación del total de
    // ventas de cada restaurante en un período en específico.

    // 4. Generar una consulta en donde se ingrese como parámetros (opcionales) un rango
    // de fechas, y un restaurante (también opcional, si no se envía se realiza a
    // todos los restaurantes) y esta retorne un análisis en donde compare en los 7
    // días de la semana qué ingrediente se vendió más, cual fue la ganancia
    // (suma de todos los platillos que incluyen dicho ingrediente) obtenida por esas ventas.
    $scope.restaurants=[];
    $scope.ingredients=[];
    $scope.info={};
    $http.post('/getRestaurants')
    .then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.dir(response);
        if(response.data[0].length!=0){
          var i;
          for(i=0;i<response.data[0].length;i++){
            var restAux={};
            restAux.id=response.data[0][i].Id;
            restAux.name=response.data[0][i].Nombre;
            restAux.category=response.data[0][i].Categoria;
            restAux.isSelected=false;
            $scope.restaurants.push(restAux);
          }
        }
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert('error on storage')
      });

      $http.post('/getAllIngredients')
      .then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.dir(response);
          if(response.data[0].length!=0){
            var i;
            $scope.ingredients=[];
            for(i=0;i<response.data[0].length;i++){
              var ingredientAux={};
              ingredientAux.id=response.data[0][i].Id;
              ingredientAux.name=response.data[0][i].Nombre;
              ingredientAux.url=response.data[0][i].Foto;

              $scope.ingredients.push(ingredientAux);
            }
          }
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert('error on storage')
        });
      $scope.incomes=function(){
        if($scope.info.restaurant!=undefined){
          alert($scope.info.restaurant)
          $scope.info.idRest=$scope.info.restaurant;
        }else{
          $scope.info.idRest=undefined;
        }
        $http.post('/incomes',$scope.info)
        .then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.dir(response);
            if(response.data[0].length!=0){
              var i;
              $scope.ingredients=[];
              for(i=0;i<response.data[0].length;i++){
                var restAux={};
                restAux.name=response.data[0][i].Nombre;
                restAux.income=response.data[0][i].Ganancia;
                $scope.restaurants.push(restAux);
              }
            }
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('error on storage')
          });
          $scope.toShow='incomes';
      }
      $scope.ingredientSales=function(){

        $scope.toShow='ingredientSales';
        var data={};
        data.idUser=$rootScope.id;
        if($scope.info.restaurant!=undefined){
          alert($scope.info.restaurant)
          data.idRest=$scope.info.restaurant;
        }else{
          data.idRest=undefined;
        }
        if($scope.info.ingredient!=undefined){
          data.idIngre=$scope.info.ingredient;
        }else{
          data.idIngre=undefined;
        }
        data.date=$scope.info.date;
        data.date2=$scope.info.date2;

        $http.post('/ingredientSales',data)
        .then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.dir(response);
            if(response.data[0].length!=0){
              var i;
              $scope.information=[];
              for(i=0;i<response.data[0].length;i++){
                var info={};
                info.orderNumber=response.data[0][i].NumeroOrden;
                info.ingredient=response.data[0][i].NombreIngrediente;
                info.dishName=response.data[0][i].NombrePlatillo;
                info.date=response.data[0][i].Fecha;
                info.restaurant=response.data[0][i].NombreRestaurante;
                info.total=response.data[0][i].Total;
                $scope.information.push(info);
              }
            }
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('error on storage')
          });
      }
      $scope.allIncomes=function(){
        $scope.toShow='allIncomes';
        var data={};
        data.date=$scope.info.date;
        data.date2=$scope.info.date2;

        $http.post('/allIncomes',data)
        .then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.dir(response);
            if(response.data[0].length!=0){
              var i;
              $scope.information=[];
              for(i=0;i<response.data[0].length;i++){
                var info={};
                info.restaurant=response.data[0][i].Restaurante;
                info.sales=response.data[0][i].Ventas;
                $scope.information.push(info);
              }
            }
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('error on storage')
          });
      }
      $scope.weeklySales=function(){
        $scope.toShow='allIncomes';
        var data={};
        data.date=$scope.info.date;
        data.date2=$scope.info.date2;
        data.idRest=$scope.info.restaurant;
        $http.post('/weeklySales',data)
        .then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.dir(response);
            if(response.data[0].length!=0){
              var i;
              $scope.information=[];
              for(i=0;i<response.data[0].length;i++){
                var info={};
                info.day=response.data[0][i].Dia;
                info.name=response.data[0][i].Nombre;
                info.numDishes=response.data[0][i].NumPlatillos
                $scope.information.push(info);
              }
            }
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert('error on storage')
          });
      }
  });


var data=function(obj){
  return obj.data[0][0];
}
