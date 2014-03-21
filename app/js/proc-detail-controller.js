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

  var parseDuration = function(duration) {

    var hours = 0;
    var minutes = 0;
    var seconds = 0.0;
    var milliseconds = 0.0;

    var h = duration.indexOf("h");
    var m = duration.indexOf("m");
    var s = duration.indexOf("s");

    if (h != -1) {
      hours=duration.substring(0, h);
      minutes=duration.substring(h+1, m);
      seconds=duration.substring(m+1, s);
    } else if (m != -1 && duration.match("ms")==null) {     // 2m42s
      hours=0;
      minutes=duration.substring(0, m);
      seconds=duration.substring(m+1, s);
    } else if (s != -1 && duration.match("ms")==null) {
      hours=0;
      minutes=0;
      seconds=duration.substring(0, s);
    } else {
      milliseconds=duration.substring(0, duration.length-2);
    }

    return convertToSeconds(hours, minutes, seconds, milliseconds);
  }

  var convertToSeconds = function(h, m, s, ms) {

    var hours = parseInt(h);
    var minutes = parseInt(m);
    var seconds = parseInt(s);
    var milliseconds = parseInt(ms);

    // --- Aggregate and calculate ---
    return ((3600*hours) + (60*minutes) + (seconds) + (milliseconds/1000));
  }

  var getHistory = function() {
      $http.get('http://'+$routeParams.host+'/procs/'+$routeParams.procId+'/history').then(function(result){

      var serverTime = result.data.serverTime;
      var history = result.data.history;
      $scope.history = []
      for(var i in history) {
        var duration = parseDuration(history[i].cumulativeTime);
        var cumulativeTime = toHHMMSS(duration);
        $scope.history.push({cumulativeTime: cumulativeTime,
                             status:result.data.history[i].status});
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

