//stopMotion object

var stopMotion = {
  on : false,
  reverse: false,
  interval : 500,
  controls : {'interval': 500, 'frames': '[ , ]','reverse': 'false'},

  start: function(){
  	clearInterval(stopMotion.animate);
  	var i = 0;
  	var stills = document.querySelectorAll('.js-selected-still');
    if (stills.length){
    stopMotion.animate = setInterval(function(){
      effects[allEffects[0]]["bottom"] = seriously.source(stills[i]);
      i++; 
      if (i >= stills.length) { i = 0; } 
    }, stopMotion.interval); 
    stopMotion.on = true;       
  }
  },
  reverse: function(){

  },
  stop : function(){
  	clearInterval(stopMotion.animate); 
  	stopMotion.on = false; 
  } 
};