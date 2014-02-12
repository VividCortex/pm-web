var pmWebApp = angular.module('pmWebApp', [
  'ngRoute',
  'pmWebControllers'
]);

//TODO make it so that you can go to localhost:8000/procs rather than localhost:8000/app/index.html#/procs
pmWebApp.config(
  function($routeProvider) {
    $routeProvider.when('/procs', {
      templateUrl: 'partials/proc-list.html',
      controller: 'ProcListCtrl'
    }).when('/proc/:host/:procId', {
      templateUrl: 'partials/proc-detail.html',
      controller: 'ProcDetailCtrl'
    });
  }
)

var pmWebControllers = angular.module('pmWebControllers',[]);
