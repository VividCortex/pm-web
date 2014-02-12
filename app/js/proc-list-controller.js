pmWebControllers.controller("ProcListCtrl", function($scope, $http, $timeout, $q, $location) {
  var getItems = function($scope, $http) {
    var hosts = $scope.hosts;
    for(var i in hosts) {
      if(hosts[i].active){
        var host = hosts[i].address ;
        $http.get('http://'+hosts[i].address+'/procs/').then(function(response) {
          console.log(host,$scope.procs)
          $scope.procs = _.filter($scope.procs, function(proc) {
            return proc.host != host;
          });
          console.log(host,$scope.procs)
          var serverTime = Date.parse(response.data.serverTime);
          var procs = response.data.procs;
          for(var j in procs) {
            proc = {};
            proc.host = host;
            proc.id = procs[j].id;
            proc.status = procs[j].status;
            proc.statusTime = Date.parse(procs[j].statusTime);
            proc.procTime = Date.parse(procs[j].procTime);
            proc.runningProcTime = (serverTime - proc.procTime)/1000.0;
            $scope.procs.push(proc)
          }
          console.log(host,$scope.procs)
        }).catch(function(response) {
          $scope.procs = _.filter($scope.procs, function(proc) {
            return proc.host != hosts[i].address;
          });
        })
      }
    }
  }

  $scope.procs = [];
  $scope.hosts = [];
  if($location.search()["host"]) {
    var hosts = $location.search()["host"].split(',');
    for(var i in hosts){
      $scope.hosts.push({address: hosts[i], active:true});
    }
  }
  (function tick() {
    getItems($scope, $http);
    //$timeout(tick, 1000);
  })();
  
  $scope.cancel = function(process) {
      $http({method: "delete", url:"http://"+process.host.address+"/procs/"+process.id, data:{message: "Cancel message"}});
  };

  $scope.addHost = function() {
    $scope.hosts.push({address: $scope.hostAddress, active: true});
    hosts = $location.search()["host"];
    if(hosts) {
      $location.search("host",hosts+","+$scope.hostAddress);
    } else {
      $location.search("host",$scope.hostAddress);
    }
  };

  $scope.removeHost = function(host) {
    $scope.hosts.splice($scope.hosts.indexOf(host), 1);
    hosts = $location.search()["host"].split(',');
    hosts.splice(hosts.indexOf(host.address),1);
    $location.search("host",hosts.join(','));
  }

  $scope.orderProp = "runningProcTime"
});


