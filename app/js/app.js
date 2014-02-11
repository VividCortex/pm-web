var pmWebApp = angular.module('pmWebApp', [
  'ngRoute',
  'pmWebControllers'
]);

pmWebApp.config(
  function($routeProvider) {
    $routeProvider.when('/list', {
      templateUrl: 'partials/proc-list.html',
      controller: 'ProcListCtrl'
    }).when('/detail', {
      templateUrl: 'partials/proc-detail.html',
      controller: 'ProcDetailCtrl'
    });
  }
)

var pmWebControllers = angular.module('pmWebControllers',[]);
