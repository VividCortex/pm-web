pmWebControllers.controller("ProcListCtrl", function($scope, $http, $timeout, $q, $location) {


  var removeAllProcsForHost = function(host) {
    $scope.procs = _.filter($scope.procs, function(proc) {
      return proc.host != host;
    });
  }
  var getHosts = function($scope, $http) {
    var hosts = $scope.hosts;
    for(var i in hosts) {
      if(hosts[i].active){
        $http.get('http://'+hosts[i].address+'/procs/').then(function(response) {
          var host = response.config.url.split('/')[2];
          removeAllProcsForHost(host);
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
        }).catch(function(response) {
          var host = response.config.url.split('/')[2];
          removeAllProcsForHost(host);
          _.find($scope.hosts,function(h) {
            return h.address == host;
          }).active = false;
        });
      } else {
        removeAllProcsForHost(hosts[i].address);
      }
    }
  }
  $scope.poll = 2;
  $scope.procs = [];
  $scope.hosts = [];
  if($location.search()["host"]) {
    var hosts = $location.search()["host"].split(',');
    for(var i in hosts){
      $scope.hosts.push({address: hosts[i], active:true});
    }
  }
  (function tick() {
    var pollTime=$scope.poll*1000;
    getHosts($scope, $http);
    $timeout(tick, pollTime);
  })();

  $scope.cancel = function(process) {
      $http({method: "delete", url:"http://"+process.host+"/procs/"+process.id, data:{message: "Cancel message"}});
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
  $scope.orderBy = function(field) {
    $scope.orderProp = field;
  }

});


