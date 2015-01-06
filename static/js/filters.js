var allEffects = ['fader'];
var mult = {'blur':.01, 'fader':.04, 'exposure':.04, 'noise':.1, 'vignette': 1 };

//holiday objects
var holiday = { 
  on : false,
  amount : 0,
  colors : [],
  effects : {'christmas': ['"red"','"green"'] , 'chanukah': ['"blue"','"white"'] , 'new-years': ['"red"','"green"','"blue"','"pink"'] },
  start: function(){
    clearInterval(holiday.animate);
    var ix;
    var color;
      holiday.animate = setInterval(function (){
        ix = Math.floor(holiday.colors.length * Math.random() );
        color = holiday.colors[ix];
        effects.fader.amount = .01 * holiday.amount;
        effects.fader.color = color;
      }, 500);
    holiday.on = true;
  },
  stop : function(){
    clearInterval(holiday.animate);
    holiday.on = false;
  }
};

// var holidays = function(colors) {

// };

//end holidays 

var labelLines = function() {
  //this function should take an input for the relevant effect, not brute force for all
  for (var e=0; e< allEffects.length; e++){
    $("pre:contains('effects."+allEffects[e]+"')").addClass('active-effect');
    $("pre:contains('effects."+allEffects[e]+"')").attr('name',allEffects[e]);
  }
}

var InitSetup = function(){
   //check Seriously compatibility
  if (Seriously.incompatible() || !Modernizr.webaudio || !Modernizr.csstransforms) {
    $('.compatibility-error').removeClass('is-hidden');
  } else {
    InitSeriously();
  }  
  movie.removeEventListener('canplay', InitSetup, false);
}

var InitSeriously = function(){
  video = seriously.source('#myvideo');
  target = seriously.target('#canvas');
  var thisEffect;
  effects[allEffects[0]]= thisEffect = seriously.effect(allEffects[0]);
  effects[allEffects[0]]["source"] = video;
  thisEffect.amount = 0;
  for (var i=1;i<allEffects.length;i++){
    effects[allEffects[i]]= thisEffect = seriously.effect(allEffects[i]);
    effects[allEffects[i]]["source"] = effects[allEffects[i-1]];
    thisEffect.amount = 0;
  }
  target.source = effects[allEffects[allEffects.length-1]];
};

var updateScript = function() {
  var scriptOld = document.getElementById('codeScript');
  if (scriptOld) { scriptOld.remove();}
  var scriptNew   = document.createElement('script');
  scriptNew.id = 'codeScript';
  var cmScript = myCodeMirror.getValue();
  var adjScript = "";
  var textScript = "\n\ try {\n\ "+cmScript;

  if (textScript.indexOf('effects.sepia')>=0) {
    if (allEffects.indexOf('sepia')<0) {
      allEffects.push('sepia');
      InitSeriously();
    }
  } else {
    var si = allEffects.indexOf('sepia');
    if (si>=0) {
      allEffects.splice(si,1);
      InitSeriously();
    }
  }

  if (textScript.indexOf('holiday.')>=0) {
    if (!holiday.on) {
      holiday.start();
    }
  } else {
    if (holiday.on) {
      effects.fader.amount = 0;
      holiday.stop();
    }
  }

  labelLines();
  var matchEff = document.querySelectorAll(".active-effect");
  var matchNames = [];

  $('.btn-method').removeClass('is-active');
  for (var t = 0; t < matchEff.length; t++) {
    var matchE = matchEff[t];
    matchNames.push($(matchE).attr("name"));
    checkBtnStatus(matchE);
  }

  eval(cmScript);

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

var checkBtnStatus = function(effect) {
  //compare the names of effect buttons to the names in activeEffects
  var effectName = $(effect).attr("name");
  $('li[name=' + effectName + ']').addClass("is-active")

}
