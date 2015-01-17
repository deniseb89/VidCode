//Lesson objects

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
      effects[allEffects[0]]["source"] = seriously.source(this.still);
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


//implement similar object for filters, graphics, movie, img
// var effects = {
//   allEffects = ['blur', 'noise', 'vignette', 'exposure', 'fader', 'kaleidoscope'],
//   seriouslyEffects: null,
//   mult : {'blur': .01, 'noise': .1, 'vignette': 1, 'exposure': .04, 'fader': .04, 'kaleidoscope': 1, 'saturation': .1};
//   defaultValue : {'number': 5, 'color': '"red"'};
// };

// var movieObj = {
//   src: "/img/wha_color.mp4",
//   play: function() {

//   },
//   pause: function() {

//   },
//   speed: movie.playbackRate,
//   length: movie.duration
// };