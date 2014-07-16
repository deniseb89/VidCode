    var video_filtered;
    var step2 = 0;
    var step3 = 0;
    var step4 = 0;
    
    var labelLines = function() {
      $("pre:contains('movie.playbackRate')").addClass('line-speed');
      $(".line-speed").find('.cm-number').addClass('num-speed');
      $(".line-speed").find('span').addClass('cm-speed');
    }

    var InitSeriously = function(){
      video = seriously.source("#myvideo");
      target = seriously.target('#canvas');
      target.source = video;
    };

    var updateScript = function() {
      var scriptOld = document.getElementById('codeScript');
      if (scriptOld) { scriptOld.remove();}
      var scriptNew   = document.createElement('script');
      scriptNew.id = 'codeScript';
      var cmScript = myCodeMirror.getValue();
      var adjScript = "";
      var textScript = "\n\ try {\n\ "+cmScript;
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