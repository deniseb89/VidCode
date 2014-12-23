
var stopMotion;
var frameArray=[];
var interval;

var loopStills = function(stills){

	//only run this if stopMotion has been initialized in the editor

  clearInterval(stopMotion);
  var i = 0;
  stopMotion = setInterval(function(){
    var still = seriously.source(stills[i]);
    target.source = still;
    i++;
    if (i >= stills.length) { i = 0; }
  }, interval)
};
