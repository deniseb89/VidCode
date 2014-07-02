    var movie = document.getElementById('myvideo');
    var seriously,
    video,
    video_filtered,
    vidLen,
    target,
    allEffects,
    activeEffects,
    effects = {},
    videoSamples = {},
    windowObjectReference = null;

$( document ).ready(function() {

    var step2 = 0;
    var step3 = 0;
    var step4 = 0;
    videoSamples["flower"] = "/img/demo.mp4";
    videoSamples["origami"] = "/img/wha_color.mp4";
    allEffects = ["filmgrain","blur","vignette","noise","exposure","fader"];
    activeEffects = [];
    var editor_text = $('textarea').text();
    seriously = new Seriously();

    function InitSeriously(){
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

    seriously.go();

    var delay=1000//1 seconds
    setTimeout(InitSeriously,delay);

    var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('codemirror'),  {
          mode:  "javascript",
          theme: "solarized light",
          lineWrapping: true,
          lineNumbers: true
        });

    $('.CodeMirror-code').addClass('is-hidden');
    var codeDelay;
    myCodeMirror.on("change", function() {
              clearTimeout(codeDelay);
              codeDelay = setTimeout(updateScript, 300);
      });

    function updateScript() {
      var scriptOld = document.getElementById('codeScript')
      if (scriptOld) { scriptOld.remove();}
      var scriptNew   = document.createElement('script');
      scriptNew.id = 'codeScript';
      var cmScript = myCodeMirror.getValue();
      var adjScript = "";
      var textScript = "\n\ try {\n\ "+cmScript;
      labelLines();
      var matches = document.querySelectorAll(".cm-number");
      var matchIDs = [];
      for (var i = 0; i < matches.length; i++)
      {
        var match = matches[i];
        var matchID = $(match).attr('id');
        matchIDs.push(matchID);
      }

         if (matchIDs.indexOf('num-filmgrain')!=-1){
          adjScript+="\n\ effects.filmgrain.amount = parseInt($('#num-filmgrain').text())/10;";
         } else {
          adjScript+="\n\ effects.filmgrain.amount = 0;";
         }
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

    $('.js-reset-code').click(function (){
      myCodeMirror.setValue(editor_text);
      for (var i=0; i<allEffects.length; i++) {
        var eff = allEffects[i];
        $('[name='+eff+']').removeClass("is-active");
      }
    });

    $('.js-close-steps').click(function(){
      $('.step4.ch1').addClass('is-hidden');
    });

    function labelLines(){
      //this function should take an input for the relevant effect, not brute force for all
      //also take note of whats active and whats not here (filters as well video-related code lines)
      for (var e=0; e< allEffects.length; e++){
        $("pre:contains('effects."+allEffects[e]+"')").addClass('line-'+allEffects[e]);
        $(".line-"+allEffects[e]).find('.cm-number').attr('id','num-'+allEffects[e]);
        $(".line-"+allEffects[e]).find('span').addClass('cm-'+allEffects[e]);
      }
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

  var timeshasdropped = 0;

    $(".tabs-2").droppable({
        drop: function( event, ui ) {
          if (timeshasdropped === 0){
            $('.step0.ch1').addClass('is-hidden');
            $('.step1.ch1').removeClass('is-hidden');
          }
          timeshasdropped++;

          eff = ui.draggable.attr("name");
          $('[name='+eff+']').addClass("is-active");

          // var thisEffect = seriously.effect(eff);
          //generalize for all effect inputs
          if (eff!="sepia"){
            myCodeMirror.replaceRange('\n\ effects.'+eff+'.amount = 5;',CodeMirror.Pos(myCodeMirror.lastLine()));
            myCodeMirror.markText({ line: myCodeMirror.lastLine(), ch: 0 }, CodeMirror.Pos(myCodeMirror.lastLine()), { className: "cm-" + eff });
            if (eff=="fader") {
              myCodeMirror.replaceRange('\n\ effects.'+eff+'.color = "red";',CodeMirror.Pos(myCodeMirror.lastLine()));
              myCodeMirror.markText({ line: myCodeMirror.lastLine(), ch: 0 }, CodeMirror.Pos(myCodeMirror.lastLine()), { className: "cm-" + eff });
              $('.step0.ch2').addClass('is-hidden');
              $('.step2.ch2').addClass('is-hidden');
              $('.step1.ch2').removeClass('is-hidden');
            }
          } else {
            myCodeMirror.replaceRange('\n\ effects.'+eff+';',CodeMirror.Pos(myCodeMirror.lastLine()));
            myCodeMirror.markText({ line: myCodeMirror.lastLine(), ch: 0 }, CodeMirror.Pos(myCodeMirror.lastLine()), { className: "cm-" + eff });
            $('.step0.ch2').addClass('is-hidden');
            $('.step1.ch2').addClass('is-hidden');
            $('.step2.ch2').removeClass('is-hidden');
          }

          myCodeMirror.save();
          //labelLines(eff);
          labelLines();
          $(".line-"+eff).effect("highlight",2000);
        }
      });

    $('#methodList li').each(function(){
      $(this).draggable({
        helper: "clone",
        revert: "invalid"
      });
    });

    $(".draggable").click(function(){
      var eff = ($(this).attr('name'));

      $('[name='+eff+']').removeClass("is-active");

      var allTM = myCodeMirror.getAllMarks();
      for (var m=0; m<allTM.length; m++){
        var tm = allTM[m];
        if (tm.className=="cm-"+eff){
          myCodeMirror.removeLine(tm.find().to.line);
        }
      }
      myCodeMirror.save();
      });

    $(".tab2").click(function(){
        $(".tabs-2").removeClass("is-hidden");
    });

    $(".tab1").click(function(){
        $(".tabs-1").removeClass("is-hidden");
        $(".tabs-2").addClass("is-hidden");
    });

    $(".layer1").click(function(){
        $(".displaysecond").animate({
            "margin-left": 0}, "ease", function(){
                $(".displayfirst").addClass("hidden2");
            });
        $(".tabs-1").removeClass("is-hidden");
    });

    //video events

    function showVid(){
      $(".popup").addClass("is-hidden");
      $(".clearHover").addClass("is-hidden");
      $(".buttons").addClass("is-aware");
      $(".runbtn").removeClass("is-hidden");
      $(".video2").removeClass("is-hidden");
      $(".js-appear").removeClass("is-hidden");
      $('.CodeMirror-code').removeClass('is-hidden');
      $('.step0').removeClass('is-hidden');
      vidLen = Math.round(this.duration);
    };

    $(".uploadfile").click(function(){
        $(".uploadform p").text('Video loading...');
    });
    $(".uploadform").submit(function(e) {
      var formObj = $(this);
      var formURL = formObj.attr("action");
      var formData = new FormData(this);
      $.ajax({
          url: formURL,
      type: 'POST',
          data:  formData,
      mimeType:"multipart/form-data",
      contentType: false,
          cache: false,
          processData:false,
      success: function(data, textStatus, jqXHR){
        // add a progress bar instead of "loading/buffering" text
        $(".uploadform p").text('Video buffering...');
           movie.src="data:video/mp4;base64,"+data;
           movie.addEventListener("loadeddata", showVid, false);
         },
       error: function(jqXHR, textStatus, errorThrown){
        $(".uploadform p").text('Video is larger than 10MB. Select a smaller video and try again!');
       }
      });
      e.preventDefault();
    });

    $(".js-instagram-import").click(function(){
        $.ajax('/instagramVid',{
          success: function(data, textStatus, jqXHR){
            movie.src="data:video/mp4;base64,"+data;
            movie.addEventListener("loadeddata", showVid, false);
          },
          error: function(data, textStatus, jqXHR){
            alert("You don't have any Instagram videos :(");
          }
      });
    });

    //whammy section
    var canvas = document.getElementById('canvas');
    var rafId;
    var frames = [];
    var capture;
    var videoDLurl;

    function drawVideoFrame(time) {
      rafId = requestAnimationFrame(drawVideoFrame);
      capture = frames.length*60/1000;
      captureTxt = Math.floor(100*capture/vidLen)+'%';
      $('.dl-progress').css('width',captureTxt);
      $('.dl-progress').text(captureTxt+' complete');
      frames.push(canvas.toDataURL('image/webp', 1));
      if (capture>=vidLen){ stopDL();}
    };

    function stopDL() {
      cancelAnimationFrame(rafId);
      var webmBlob = Whammy.fromImageArray(frames, 1000 / 60);
      video_filtered = webmBlob;
      var videoDL = document.getElementById('video-dl');
      videoDLurl = window.URL.createObjectURL(webmBlob);
      videoDL.src = videoDLurl;
      videoDL.controls = true;
      videoDL.load();
      $('#dLink').attr('href', videoDLurl);
      $('#export').text('Save video');
      $("body").css("cursor", "auto");
      $("#export").css("cursor", "auto");
      $('#export').attr('disabled',false);
      $('#dLbtn').attr('disabled',false);
      $('#youtube').attr('disabled',false);
      $('.dl-progress').text('All Finished!');      
      $('.share-btn').removeClass('is-hidden');
    };

    $("#gallery-share").click(function(){
      windowObjectReference = window.open('/gallery?userVidURL='+videoDLurl,'GalleryPage','resizable,scrollbars');
    });

    $("#email-share").click(function(){
      windowObjectReference = window.open('https://gmail.com');
    });

    $("#export").click(function(){
      //restart video from 1 and only retrieve frame when playing
      $('.progressDiv').removeClass('is-hidden');
      rafId = requestAnimationFrame(drawVideoFrame);
      $(this).text('Saving...');
      $("body").css("cursor", "progress");
      $(this).css("cursor","progress");
      $(this).attr('disabled',true);
    });

    $('#youtube').click(function(){
      $('.YouTube').removeClass('is-hidden');
    });

    $(".js-upload-video").click(function(){
        $(".popup").removeClass("is-hidden");
    });

    $(".js-hide-upload").click(function(){
        $(".popup").addClass("is-hidden");
    });

    $(".js-uploadOrig").click(function(){
        movie.src="/img/demo.mp4";
        movie.addEventListener("loadeddata", showVid, false);
      });

    $(".js-uploadFlwr").click(function(){
        movie.src="/img/wha_color.mp4";
        movie.addEventListener("loadeddata", showVid, false);
      });

    $(".runbtn").click(function(){
        $(".video2").removeClass("is-hidden");
        movie.paused ? movie.play() : movie.pause();
    });

    movie.addEventListener('playing',function(){
      //also update movie.___() line in code editor
         $(".runbtn").text('Pause');
    });

    movie.addEventListener('pause',function(){
      //also update movie.___() line in code editor
         $(".runbtn").text('Play');
    });

    $( "ul, li" ).disableSelection();

    //hover state of learn more section
    $('.js-object').hover(function(){
      showInfo("movie", "rgba(49, 150, 101, .4)");
    }, function(){
      removeInfo("movie");
    });
    $('.js-movie').hover(function(){
      showInfo("movie", "rgba(49, 150, 101, .4)");
    }, function(){
      removeInfo("movie");
    });
    $('.js-effects').hover(function(){
      showInfo("effect", "rgba(49, 150, 101, .4)");
    }, function(){
      removeInfo("effect");
    });
    $('.js-seriously').hover(function(){
      showInfo("seriously", "rgba(49, 150, 101, .4)");
    }, function(){
      removeInfo("seriously");
    });
    $('.js-filmgrain').hover(function(){
      showInfo("filmgrain", "rgba(49, 150, 101, .4)");
    }, function(){
      removeInfo("filmgrain");
    });
    $('.js-function').hover(function(){
      showInfo("function", "rgba(221, 57, 169, .4)");
    }, function(){
      removeInfo("function");
    });
    $('.js-showeffect').hover(function(){
      showInfo("showEffect", "rgba(221, 57, 169, .4)");
    }, function(){
      removeInfo("showEffect");
    });
    $('.js-play').hover(function(){
      showInfo("play", "rgba(50, 98, 234, 0.4)");
    }, function(){
      removeInfo("play");
    });
    $('.js-interval').hover(function(){
      showInfo("interval", "rgba(50, 98, 234, 0.4)");
    }, function(){
      removeInfo("interval");
    });

    $('.runbtn').hover(function(){
      showInfo("play", "rgba(212, 63, 58, 0.4)");
    }, function(){
      removeInfo("play");
    });

    $('.runbtn').hover(function(){
      showInfo("pause", "rgba(212, 63, 58, 0.4)");
    }, function(){
      removeInfo("pause");
    });

    var showInfo = function(term, color){
      $('pre:contains('+term+')').css("background-color", color );
    };

    var removeInfo = function(term){
      $('pre:contains('+term+')').css("background", "none" );
    };

});
