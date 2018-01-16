'use strict';

angular.
  module('AccountingFEapp').
  config(['$locationProvider' ,'$routeProvider', '$mdThemingProvider',
    function config($locationProvider, $routeProvider, $mdThemingProvider) {
      $locationProvider.hashPrefix('!');

      // App Routing
      $routeProvider.
        when('/login', {
          template: '<auth-form></auth-form>',
          secure: false
        }).
        when('/purchases', {
          template: '<purchase-table></purchase-table>',
          secure: true
        }).
        when('/purchaseform/:id', {
          template: '<purchase-form></purchase-form>',
          secure: true
        }).
        when('/purchaseform', {
          template: '<purchase-form></purchase-form>',
          secure: true
        }).
        otherwise('/login');

        // App Theming
        $mdThemingProvider.theme('default')
          .primaryPalette('blue',{
            'default':'700'
          })
          .accentPalette('pink');

          $mdThemingProvider.theme('dark', 'default')
          .primaryPalette('blue',{
            'default':'A200'
          })
          .dark();
    }
  ]).run(['$rootScope', '$location', 'Auth',
          function($rootScope, $location, Auth) {

            $rootScope.$on("$routeChangeStart", function(event, next, current) {
              if(next && next.$$route && next.$$route.secure) {
                if(!Auth.user.isLogged) {
                  console.log('User not Authenticated!')
                  $rootScope.$evalAsync(function () {
                    $location.path("/login")
                  });
                  event.preventDefault();
                }
              }
              else if(next && next.$$route && next.$$route.originalPath=="/login") {
                if(Auth.user.isLogged) {
                  console.log('User is already Authenticated!')
                  $rootScope.$evalAsync(function () {
                    $location.path("/purchases")
                  });
                  event.preventDefault();
                }
              }
            });
          }
    ]);
