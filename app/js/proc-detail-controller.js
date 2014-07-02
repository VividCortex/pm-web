pmWebControllers.controller("ProcDetailCtrl", function($scope, $routeParams, $http, $timeout) {

  var toHHMMSS = function(sec_num) {
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
  }

  var getHistory = function() {
    $http.get('http://'+$routeParams.host+'/procs/'+$routeParams.procId+'/history').then(function(result){
      var serverTime = result.data.serverTime;
      $scope.history = []
      for(var i in result.data.history) {
        var millisecs = Date.parse(serverTime)-Date.parse(result.data.history[i].ts);
        var cumulativeTime = toHHMMSS(millisecs/1000);
        $scope.history.push({cumulativeTime: cumulativeTime,
                             status:result.data.history[i].status})
      }
      $timeout(getHistory, 1000);
    }).catch(function(result){
      $scope.active = false;
    });
  }
  getHistory();

  $scope.active = true;
  $scope.host = $routeParams.host;
  $scope.procId = $routeParams.procId;

  $scope.cancel = function(host,procId) {
    $http.delete("http://"+ host +"/procs/"+ procId).then(function(r) {console.log(r)});
  }
});

