﻿'use strict';

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
    for(var rest in $scope.restaurants){
      if (rest.isSelected){
        $scope.ingredient.restaurant=rest.id;
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
restaurantSystem.controller('billingCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
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
              ingredientAux.id=response.data[0][i].Id;
              ingredientAux.name=response.data[0][i].Nombre;
              ingredientAux.price=response.data[0][i].Precio;
              ingredientAux.quantity=response.data[0][i].Cantidad;
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
});
restaurantSystem.controller('newRestaurantCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
});
restaurantSystem.controller('inventoryCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
});

var data=function(obj){
  return obj.data[0][0];
}
