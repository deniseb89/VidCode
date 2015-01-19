//stopMotion object

var stopMotion = {
  on : false,
  reverse: false,
  interval : 500,
  controls : {'interval': 500, 'frames': '[ , ]','reverse': 'false'},
  still: null,

  start: function(){
  	clearInterval(stopMotion.animate);
    if (this.interval <20) {
      this.adjustInterval(20);
    } else if (this.interval>2000) {
      this.adjustInterval(2000);
    }
    this.interval = Math.min(2000, this.interval);
  	
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