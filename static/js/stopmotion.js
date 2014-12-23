var allEffects = [];
var stopMotion;
var mult = {'blur':.01, 'fader':.04, 'exposure':.04, 'noise':.1, 'vignette': 1 };

var labelLines = function() {
  //this function should take an input for the relevant effect, not brute force for all
  for (var e=0; e< allEffects.length; e++){
    $("pre:contains('effects."+allEffects[e]+"')").addClass('active-effect');
    $("pre:contains('effects."+allEffects[e]+"')").attr('name',allEffects[e]);
  }
}

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

var InitSeriously = function(){
  //check Seriously compatibility. Seriously.incompatible ?
  var thisEffect;
  stills = document.querySelectorAll('.js-img-still');
  var still = seriously.source(stills[0]);
  target = seriously.target(canvas);
  effects[allEffects[0]]= thisEffect = seriously.effect(allEffects[0]);
  effects[allEffects[0]]["source"] = still;
  thisEffect.amount = 0;
  for (var i=1;i<allEffects.length;i++){
    effects[allEffects[i]]= thisEffect = seriously.effect(allEffects[i]);
    effects[allEffects[i]]["source"] = effects[allEffects[i-1]];
    thisEffect.amount = 0;
  }
  target.source = effects[allEffects[allEffects.length-1]];
  
  //Remove the event listener so that we aren't reinitialzing every time user selects a new video
  movie.removeEventListener('canplay', InitSeriously, false);

};


var updateScript = function() {
  var scriptOld = document.getElementById('codeScript');
  if (scriptOld) { scriptOld.remove();}
  var scriptNew   = document.createElement('script');
  scriptNew.id = 'codeScript';
  var cmScript = myCodeMirror.getValue();
  eval(cmScript);
  var adjScript = "";
  var textScript = "\n\ try {\n\ "+cmScript;

  if (textScript.indexOf('effects.sepia')>=0) {
    if (allEffects.indexOf('sepia')<0) {
      allEffects.push('sepia');
      var thisEffect;
      effects[allEffects[0]]= thisEffect = seriously.effect(allEffects[0]);
      effects[allEffects[0]]["source"] = video;
      for (var i=1;i<allEffects.length;i++){
        effects[allEffects[i]]= thisEffect = seriously.effect(allEffects[i]);
        effects[allEffects[i]]["source"] = effects[allEffects[i-1]];
      }
      target.source = effects[allEffects[allEffects.length-1]];
      }
    } else {
      var si = allEffects.indexOf('sepia');
      if (si>=0) {
        allEffects.splice(si,1);
        InitSeriously();
      }
    }

  labelLines();
  var matchEff = document.querySelectorAll(".active-effect");

  var matchNames = [];
  $('.btn-method').removeClass('is-active');
  for (var t = 0; t < matchEff.length; t++) {
    var matchE = matchEff[t];
    matchNames.push($(matchE).attr("name"));
  }

  for (var c = 0; c < allEffects.length; c++) {
    var thisEffect = allEffects[c];
    if (matchNames.indexOf(thisEffect) < 0) {
      adjScript+="\n\ effects." + thisEffect + ".amount = 0;";
    } else {
      var adjAmt = effects[thisEffect]['amount']*mult[thisEffect];
      adjScript+="\n\ effects." + thisEffect +".amount = " +adjAmt+ ";";
    }
  }

  textScript+=adjScript;
  textScript+="\n\ } catch(e){"+ adjScript +"\n\ }";
  scriptNew.text = textScript;

  document.body.appendChild(scriptNew);
}
