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
      when('/', {  //show the restaurants by default
        resolve:{
          "check":function($rootScope,$cookies,$location){
            update($rootScope,$cookies);
          }
        },
        templateUrl: 'app/partials/viewRestaurant.html',
        controller: 'viewRestaurantCtrl'
      }).
      when('/signin', {
        templateUrl: 'app/partials/signin.html',
        controller: 'signinCtrl'
      }).
      when('/logout', {
        resolve:{
          "check":function($rootScope,$cookies,$location){
            $cookies.put('login','');
            $location.path('/')
          }
        }
      }).
      when('/signup', {
        templateUrl: 'app/partials/signup.html',
        controller: 'signupCtrl'
      }).
      when('/clientDetails', {
        resolve:{
          "check":function($rootScope,$cookies,$location){
            update($rootScope,$cookies);
            if(!$rootScope.isLogged || $rootScope.isAdmin){
              alert('This option is available just for clients')
              $location.path('/signin');
            }
          }
        },
        templateUrl: 'app/partials/clientDetails.html',
        controller: 'clientDetailsCtrl'
      }).
      when('/addIngredient', {
        resolve:{
          "check":function($rootScope,$cookies,$location){
            update($rootScope,$cookies);
            if(!$rootScope.isAdmin){
              alert('This is available just for adminstrators')
              $location.path('/signin');
            }
          }
        },
        templateUrl: 'app/partials/addIngredient.html',
        controller: 'addIngredientCtrl'
      }).
      when('/ingredientDetails', {
        templateUrl: 'app/partials/ingredientDetails.html',
        controller: 'ingredientDetailsCtrl'
      }).
      when('/billing', {
        resolve:{
          "check":function($rootScope,$cookies,$location){
            update($rootScope,$cookies);
            if(!$rootScope.isAdmin){
              alert('This is available just for adminstrators')
              $location.path('/signin');
            }
          }
        },
        templateUrl: 'app/partials/billing.html',
        controller: 'billingCtrl'
      }).
      when('/report', {
        resolve:{
          "check":function($rootScope,$cookies,$location){
            update($rootScope,$cookies);
            if(!$rootScope.isAdmin){
              alert('This is available just for adminstrators')
              $location.path('/signin');
            }
          }
        },
        templateUrl: 'app/partials/report.html',
        controller: 'reportCtrl'
      }).
      when('/newRestaurant', {
        resolve:{
          "check":function($rootScope,$cookies,$location){
            update($rootScope,$cookies);
            if(!$rootScope.isAdmin){
              alert('This is available just for adminstrators')
              $location.path('/signin');
            }
          }
        },
        templateUrl: 'app/partials/newRestaurant.html',
        controller: 'newRestaurantCtrl'
      }).
      when('/inventory', {
        resolve:{
          "check":function($rootScope,$cookies,$location){
            update($rootScope,$cookies);
            if(!$rootScope.isAdmin){
              alert('This is available just for adminstrators')
              $location.path('/signin');
            }
          }
        },
        templateUrl: 'app/partials/inventory.html',
        controller: 'inventoryCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);


  var update=function(rootScope,cookies){
    if(cookies.get('login')!=undefined && cookies.get('login')!='')
    {
      if(cookies.get('login')=='Client'){
          rootScope.isAdmin=false;
          rootScope.id=parseInt(cookies.get('userId'));
      }
      if(cookies.get('login')=='Admin'){
          rootScope.isAdmin=true;
          rootScope.id=parseInt(cookies.get('userId'));
      }
      rootScope.isLogged=true;
    }else{
      rootScope.id=-1;
      rootScope.isAdmin=false;
      rootScope.isLogged=false;
    }
  }
