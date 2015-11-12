'use strict';

/* App Module */
var restaurantSystem = angular.module('restaurantSystem', [
  'ngRoute',
  'restaurantsControllers',
  'ngCookies'
]);
restaurantSystem.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);
restaurantSystem.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/signin', {
        templateUrl: 'app/partials/signin.html',
        controller: 'signinCtrl'
      }).
      when('/signup', {
        templateUrl: 'app/partials/signup.html',
        controller: 'signupCtrl'
      }).
      when('/clientDetails', {
        templateUrl: 'app/partials/clientDetails.html',
        controller: 'clientDetailsCtrl'
      }).
      when('/addIngredient', {
        templateUrl: 'app/partials/addIngredient.html',
        controller: 'addIngredientCtrl'
      }).
      when('/ingredientDetails', {
        templateUrl: 'app/partials/ingredientDetails.html',
        controller: 'ingredientDetailsCtrl'
      }).
      when('/billing', {
        templateUrl: 'app/partials/billing.html',
        controller: 'billingCtrl'
      }).
      when('/report', {
        templateUrl: 'app/partials/report.html',
        controller: 'reportCtrl'
      }).
      when('/viewRestaurant', {
        templateUrl: 'app/partials/viewRestaurant.html',
        controller: 'viewRestaurantCtrl'
      }).
      when('/newRestaurant', {
        templateUrl: 'app/partials/newRestaurant.html',
        controller: 'newRestaurantCtrl'
      }).
      otherwise({
        redirectTo: '/signin'
      });
  }]);
