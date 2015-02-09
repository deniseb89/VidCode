var removeStopMotionInEditor = function(){

  var allTM = myCodeMirror.getAllMarks();
    for (var m=0; m<allTM.length; m++){
      var tm = allTM[m];
      if (tm.className=="cm-frames"){
        var cmLine = tm.find();
        myCodeMirror.removeLine(cmLine.to.line);
      }
      else if (tm.className=="cm-interval"){
        var cmLine = tm.find();
        myCodeMirror.removeLine(cmLine.to.line);
      }      
    } 
    stopMotion.stop();
}


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
        if (eff=="reverse") {
          var text = '\n\ stopMotion.reverse();';
        } else {
          var text = '\n\ stopMotion.' + eff + ' = ' + stopMotion.controls[eff] + ';';          
        }
        createCodeInEditor(text, "cm-"+eff); 
        if (eff == "interval") {
            updateLearnMoreSlide('2-3');
        }
    } 

};

//create stop Motion object
var stopMotion = {
  on : false,
  // reverse: false,
  interval : 500,
  controls : {'interval': 500, 'frames': '[ , ]','reverse': 'false'},
  still: null,
  iterator: 0,
  stills: [],
  frames: [],
  dragID: "",
  min: 20,
  max: 2000,

  start: function(){
    clearInterval(stopMotion.animate);
    this.stills = [];

    for (var i=0; i<stopMotion.frames.length; i++){
      this.stills.push(document.getElementById(stopMotion.frames[i]));
    }
    this.iterator = 0;

    if (stopMotion.interval < stopMotion.min) {
      stopMotion.interval = stopMotion.min;
      this.adjustInterval(stopMotion.min);
    }
    else if (stopMotion.interval > stopMotion.max) {
      stopMotion.interval = stopMotion.max;
      this.adjustInterval(stopMotion.max);
    }

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
      //use updatecodeineditor instead
      if (tm.className=="cm-interval"){
        var cmLine = tm.find();
        myCodeMirror.replaceRange(' stopMotion.interval = '+int+';',{ line: cmLine.to.line, ch: 0 }, CodeMirror.Pos( cmLine.to.line ) );
        myCodeMirror.markText({ line: cmLine.to.line, ch: 0 }, CodeMirror.Pos( cmLine.to.line ),{ className: "cm-interval" });
        $(".cm-interval").effect("highlight",2000);
      }
    }   
  },
  reverse: function(){
      stopMotion.frames = stopMotion.frames.reverse();
  },
  addFramesToTimeline: function(){
    var timeline = $('#timeline-sortable');
    timeline.empty();

    for (var i=0; i<stopMotion.frames.length; i++){
      var element = stopMotion.frames[i];
      element = element.replace("'", "");
      element = element.replace("'", "");

      var imgSrc = document.getElementById(element).src;
      var frameImg = '<li class="ui-state-default ui-draggable"><img src="'+imgSrc+'" class="js-timeline" id="_'+element+'"></li>';
      $('#timeline-sortable').append(frameImg);
    }
  },

  reorderFrames: function(){
    var framesTimeline = document.querySelectorAll('.js-timeline');
    var allFrames = [];

    for(var i = 0; i < framesTimeline.length; i++){
      var _id =  framesTimeline[i].id;
      _id = _id.replace("_","");

      allFrames[i] = "'"+_id+"'";
    }

    var allTM = myCodeMirror.getAllMarks();
    for (var m=0; m<allTM.length; m++){
      var tm = allTM[m];
      if (tm.className=="cm-frames"){
        var cmLine = tm.find();
        updateCodeInEditor(' stopMotion.frames = ['+allFrames+'];', cmLine.to.line, "cm-frames");
      }
    } 
    if(!framesTimeline.length){
      movie.src="";
      changeUniqueSrc(movie);
    }
    else{
      stopMotion.start();  
    }
  },
  stop : function(){
  	clearInterval(stopMotion.animate); 
  	stopMotion.on = false; 
  }
};

