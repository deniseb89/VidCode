var stopMotion;

var loopStills = function(stills){
  clearInterval(stopMotion);
  var i = 0;
  stopMotion = setInterval(function(){
    var still = seriously.source(stills[i]);
    target.source = still;
    i++;
    if (i >= stills.length) { i = 0; }
  }, 250)
}
