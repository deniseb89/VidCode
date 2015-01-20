var createStopMotionInEditor = function(eff){
    
    var effectExists = false;
    var allTM = myCodeMirror.getAllMarks();

    for (var m = 0; m < allTM.length; m++) {
        var tm = allTM[m];
        if (tm.className == "cm-"+eff) {
           effectExists = true;
        }               
    }
    if(!effectExists){
        var text = '\n\ stopMotion.' + eff + ' = ' + stopMotion.controls[eff] + ';';
        createCodeInEditor(text, "cm-"+eff); 

        if (eff == "interval") {
            updateLearnMore(3, "<p>Whoa! The images are moving now.</p><p>Remember 'Objects'? Now we have a <strong>stop motion Object</strong>.</p><p>Anything to the right of the stop motion object is a property that is being pulled out of that object. A property is kind of like an object's baby.</p><p>Objects can have millions of properties!</p><div class='btn btn-primary js-lesson-4-sm right'>More about Interval</div>", 'What did Interval change?', '');
        }
    }
 
}

//create stop Motion object
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
  adjustInterval: function(int){
    var allTM = myCodeMirror.getAllMarks();
    for (var m=0; m<allTM.length; m++){
      var tm = allTM[m];
      if (tm.className=="cm-interval"){
        var cmLine = tm.find();
        myCodeMirror.replaceRange(' stopMotion.interval = '+int+';',{ line: cmLine.to.line, ch: 0 }, CodeMirror.Pos( cmLine.to.line ) );
        myCodeMirror.markText({ line: cmLine.to.line, ch: 0 }, CodeMirror.Pos( cmLine.to.line ),{ className: "cm-interval" });
        $(".cm-interval").effect("highlight",2000);
      }
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
/*
var effects = {
  allEffects = ['blur', 'noise', 'vignette', 'exposure', 'fader', 'kaleidoscope'],
  seriouslyEffects: null,
  mult : {'blur': .01, 'noise': .1, 'vignette': 1, 'exposure': .04, 'fader': .04, 'kaleidoscope': 1, 'saturation': .1};
  defaultValue : {'number': 5, 'color': '"red"'};
};

var movieObj = {
  src: "/img/wha_color.mp4",
  play: function() {
    console.log('playing');
    return movie.play();
  },
  pause: function() {
    console.log('pause');
    return movie.pause();
  },
  speed: movie.playbackRate,
  length: movie.duration
};
*/
