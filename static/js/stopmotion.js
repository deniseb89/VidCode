//stopMotion object

var stopMotion = {
  temp: 1, 
  on : false,
  reserve: false,
  interval : 500,
  controls : {'interval': 500, 'frames': '[ , ]','reverse': 'stopMotion.reverse = false'},

  start: function(){
  	clearInterval(stopMotion.animate);
  	var i = 0;
  	var stills = document.querySelectorAll('.js-selected-still'); 
  	stopMotion.animate = setInterval(function(){
  		var still = seriously.source(stills[i]); 
  		target.source = still; 
  		i++; 
  		if (i >= stills.length) { i = 0; } 
  	}, stopMotion.interval); 
  	stopMotion.on = true; 
  },
  reserve: function(){

  },
  stop : function(){
  	clearInterval(stopMotion.animate); 
  	stopMotion.on = false; 
  } 
};