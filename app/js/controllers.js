'use strict';

/* Controllers */
var restaurantSystem = angular.module('restaurantsControllers', []);

restaurantSystem.controller('loginCtrl', function ($scope, $http,$rootScope,$location,$cookies) {

});
restaurantSystem.controller('signinCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
//new user
});
restaurantSystem.controller('clientDetailsCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
//delete the user
//modify the data
});
restaurantSystem.controller('addIngredientCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
});
restaurantSystem.controller('ingredientDetailsCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
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
});
restaurantSystem.controller('newRestaurantCtrl', function ($scope, $http,$rootScope,$location,$cookies) {
});
