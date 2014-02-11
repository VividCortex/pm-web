
pmWebControllers.controller("ProcListCtrl", function($scope, $http, $timeout, $q, $location) {
  $scope.hosts = [];
  if($location.search()["host"]) {
    var hosts = $location.search()["host"].split(',');
    for(var i in hosts){
      $scope.hosts.push({address: hosts[i], active:true});
    }
  }
  (function tick() {
    getItems($scope, $http, $q)(function(results) {
      if(results == null) return;
      $scope.processes = results.procs;
      $scope.serverTime = Date.parse(results.serverTime);
      for(i in $scope.processes) {
        $scope.processes[i].statusTime = Date.parse($scope.processes[i].statusTime);
        $scope.processes[i].procTime = Date.parse($scope.processes[i].procTime);
        $scope.processes[i].runningStatusTime = ($scope.serverTime - $scope.processes[i].statusTime)/1000.0;
        $scope.processes[i].runningProcTime = ($scope.serverTime - $scope.processes[i].procTime)/1000.0;
      }

      $scope.processes.sort(function(a, b) {
        return b.runningProcTime - a.runningProcTime;
      });
    });
    $timeout(tick, 1000);
  })();
  
  $scope.cancel = function(process) {
      $http({method: "delete", url:"http://"+process.host.address+"/procs/"+process.id, data:{message: "Cancel message"}});
  };

  $scope.addHost = function() {
    $scope.hosts.push({address: $scope.hostAddress, active: true});
    $location.search("host",$location.search()["host"]+","+$scope.hostAddress);
  };

  $scope.removeHost = function(host) {
    $scope.hosts.splice($scope.hosts.indexOf(host), 1);
    hosts = $location.search()["host"].split(',');
    hosts.splice(hosts.indexOf(host.address),1);
    $location.search("host",hosts.join(','));
  }

  $scope.orderProp = "runningProcTime"
});

function getItems($scope, $http, $q) {
  var promises = [];
  for(var i in $scope.hosts) {
    if($scope.hosts[i].active)
      promises = promises.concat($http.get('http://'+$scope.hosts[i].address+'/procs/'));
  }
  return $q.all(promises).then(function(results) {
      merged = {serverTime: "", procs: []};
      for(var i in results) {
        merged.serverTime = results[i].data.serverTime;
        for(var j in results[i].data.procs) {
          results[i].data.procs[j].host = $scope.hosts[i];
        }
        merged.procs = merged.procs.concat(results[i].data.procs);
      }
      return merged;
    }).catch(function(results) {
      // At least one of the requests failed, so we remove the
      // bad host from the array.
      for(var i in $scope.hosts) {
        if('http://'+$scope.hosts[i].address+'/procs/' === results.config.url) {
          $scope.hosts[i].active = false;
          break;
        }
      }
      return null;
    }).then;
}

