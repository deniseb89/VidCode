    var video_filtered;
    var step2 = 0;
    var step3 = 0;
    var step4 = 0;
    var allEffects = [];

    var labelLines = function() {
      //this function should take an input for the relevant effect, not brute force for all
      //also take note of whats active and whats not here (filters as well movie play-related code lines)
      for (var e=0; e< allEffects.length; e++){
        $("pre:contains('effects."+allEffects[e]+"')").addClass('line-'+allEffects[e]);
        $(".line-"+allEffects[e]).find('.cm-number').attr('id','num-'+allEffects[e]);
        $(".line-"+allEffects[e]).find('span').addClass('cm-'+allEffects[e]);
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
      var adjScript = "";
      var textScript = "\n\ try {\n\ "+cmScript;

      //filter-specific
      labelLines();
      var matches = document.querySelectorAll(".cm-number");
      var matchIDs = [];
      for (var i = 0; i < matches.length; i++)
      {
        var match = matches[i];
        var matchID = $(match).attr('id');
        matchIDs.push(matchID);
      }

         // if (matchIDs.indexOf('num-filmgrain')!=-1){
         //  adjScript+="\n\ effects.filmgrain.amount = parseInt($('#num-filmgrain').text())/10;";
         // } else {
         //  adjScript+="\n\ effects.filmgrain.amount = 0;";
         // }
         if (matchIDs.indexOf('num-blur')!=-1){
          adjScript+="\n\ effects.blur.amount = parseInt($('#num-blur').text())/100;";
         }else {
          adjScript+="\n\ effects.blur.amount = 0;";
         }
        if (matchIDs.indexOf('num-vignette')!=-1){
          adjScript+="\n\ effects.vignette.amount = Math.round(parseInt($('#num-vignette').text()));";
        } else {
          adjScript+="\n\ effects.vignette.amount = 0;";
        }
        if (matchIDs.indexOf('num-exposure')!=-1){
          adjScript+="\n\ effects.exposure.amount = parseInt($('#num-exposure').text())/25;";
        } else {
          adjScript+="\n\ effects.exposure.amount = 0;";
        }
        if ($(match).attr('id')=='num-fader'){
          adjScript+="\n\ effects.fader.amount = parseInt($('#num-fader').text())/25;";
        } else {
          adjScript+="\n\ effects.fader.amount = 0;";
        }
        if (matchIDs.indexOf('num-noise')!=-1){
          adjScript+="\n\ effects.noise.amount = parseInt($('#num-noise').text())/10;";
        } else {
          adjScript+="\n\ effects.noise.amount = 0;";
        }

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

      textScript+=adjScript;
      textScript+="\n\ } catch(e){"+ adjScript +"\n\ }";
      scriptNew.text = textScript;

      if(cmScript.indexOf(20) >= 0 && step2 === 0){
        $('.step1.ch1').addClass('is-hidden');
        $('.step2.ch1').removeClass('is-hidden');
        step2++;
      }

      var codeContents = $('.cm-property').text();
      if(codeContents.indexOf('pause') >= 0 && step3 === 0 && step2 === 1){
        $('.step2.ch1').addClass('is-hidden');
        $('.step3.ch1').removeClass('is-hidden');
        step3++;
      }

      try {
      var cmProp = $('.cm-' + eff).text();
      if(cmProp.indexOf(eff) >= 0){
      }
      else if(step4 === 0 && step3 === 1){
        $('.step3.ch1').addClass('is-hidden');
        $('.step4.ch1').removeClass('is-hidden');
        step4++;
      }; } catch(e){};

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
