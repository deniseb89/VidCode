//stopMotion object

var stopMotion = {
  on : false,
  reverse: false,
  interval : 500,
  controls : {'interval': 500, 'frames': '[ , ]','reverse': 'false'},
  still: null,

  start: function(){
  	clearInterval(stopMotion.animate);
  	var i = 0;
  	var stills = document.querySelectorAll('.js-selected-still');
 
    if (stills.length){
    stopMotion.animate = setInterval(function(){
      // this.still = stills[i];
      this.still = seriously.transform('reformat');
      this.still.width = 420;
      this.still.height = 250;
      this.still.mode = 'contain';
      this.still.source = stills[i];           
      effects[allEffects[0]]["bottom"] = seriously.source(this.still);
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