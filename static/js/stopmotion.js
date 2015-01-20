//stopMotion object

var stopMotion = {
  on : false,
  reverse: false,
  interval : 500,
  controls : {'interval': 500, 'frames': '[ , ]','reverse': 'false'},
  still: null,
  iterator: 0,
  stills: [],
  framesArr: [],

  start: function(){
    	clearInterval(stopMotion.animate);
      for (var i=0; i<stopMotion.framesArr.length; i++){
        this.stills.push(document.getElementById(stopMotion.framesArr[i]));
      }
	   console.log(stopMotion.framesArr);

     this.iterator = 0;

    if (this.stills.length){
        stopMotion.animate = setInterval(stopMotion.loop, stopMotion.interval); 
        stopMotion.on = true;       
      }
  },
  loop:  function(){
      if (stopMotion.stills.length){
        this.still = seriously.transform('reformat');
        this.still.width = 420;
        this.still.height = 250;
        this.still.mode = 'contain';
        this.still.source = stopMotion.stills[stopMotion.iterator];           
        effects[allEffects[0]]["bottom"] = seriously.source(this.still);
        stopMotion.iterator++; 
        if (stopMotion.iterator >= stopMotion.stills.length) stopMotion.iterator = 0; 
      }
  },
  reverse: function(){

  },
  stop : function(){
  	clearInterval(stopMotion.animate); 
  	stopMotion.on = false; 
  } 
};