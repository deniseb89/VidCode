    var allEffects = [];
	var mult = {'blur':.01, 'fader':.04, 'exposure':.04, 'noise':.1, 'vignette': 1 };

    var labelLines = function() {
      //this function should take an input for the relevant effect, not brute force for all
      //also take note of whats active and whats not here (filters as well movie play-related code lines)
      for (var e=0; e< allEffects.length; e++){
        $("pre:contains('effects."+allEffects[e]+"')").addClass('active-effect');
        $("pre:contains('effects."+allEffects[e]+"')").attr('name',allEffects[e]);
      }
    }

    var InitSeriously = function(){
      video = seriously.source("#myvideo");
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
      eval(cmScript);
      var adjScript = "";
      var textScript = "\n\ try {\n\ "+cmScript;

      labelLines();
      var matchEff = document.querySelectorAll(".active-effect");
      
      var matchNames = [];
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

      textScript+=adjScript;
      textScript+="\n\ } catch(e){"+ adjScript +"\n\ }";
      scriptNew.text = textScript;
      
      document.body.appendChild(scriptNew);
    }

var VigArr = {

    init : function ( element ) {
      element.node.dataset.value =  0;
    },

    start : function ( element ){
      return parseInt ( element.node.dataset.value, 10 );
    },

    change : function ( element, valin ) {

      valout = Math.floor(valin/20);
      valout = valout > 0 ? valout : 0;
      valout = valout < 10 ? valout : 10;
      element.node.dataset.value = valout;
      element.node.textContent = valout;
      if ((valin>=0)&&(valin%20)==0) {labelLines()};
    },

    end : function (element) {
        labelLines();
    }
};
