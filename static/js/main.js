    var movie = document.getElementById('myvideo');
    var seriously,
    video,
    video_filtered,
    target,
    activeEffects,
    effects = {};

$(window).load(function() {
    $('#joyRideTipContent').joyride({
        autoStart : true,
        postStepCallback : function (index, tip) {
            if (index == 2) {
                $(this).joyride('set_li', false, 1);
            }
        },
        modal:true,
        expose: true
    });


});

$( document ).ready(function() {




    var step2 = 0;
    var step3 = 0;
    var step4 = 0;

    var init_code = 1;
    var activeEffects = ["filmgrain","blur","vignette","noise","exposure"];
    var editor_text =
  "\
    \n\
    //This line of code makes your movie play!\n\
    movie.play();\n\
    //See what happens when you type movie.pause();\n\
    \n\
    //The code below lets you add, remove, and alter your video filters.\n\
    //Change the numbers and observe the effects on your video.\n\
    ";

    function InitSeriously(){
      seriously = new Seriously();
      video = seriously.source("#myvideo");
      target = seriously.target('#canvas');
      var thisEffect;
      effects[activeEffects[0]]= thisEffect = seriously.effect(activeEffects[0]);
      effects[activeEffects[0]]["source"] = video;
      thisEffect.amount = 0;
      for (var i=1;i<activeEffects.length;i++){
        effects[activeEffects[i]]= thisEffect = seriously.effect(activeEffects[i]);
        effects[activeEffects[i]]["source"] = effects[activeEffects[i-1]];
        thisEffect.amount = 0;
      }
      target.source = effects[activeEffects[activeEffects.length-1]];
      seriously.go();
    };

    var delay=1000//1 seconds
    setTimeout(InitSeriously,delay);

    var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('codemirror'),  {
          mode:  "javascript",
          theme: "solarized light",
          lineWrapping: true,
          lineNumbers: true
        });

    var codeDelay;
    myCodeMirror.on("change", function() {
              clearTimeout(codeDelay);
              codeDelay = setTimeout(updatePreview, 300);
      });

    function updatePreview() {
      var scriptOld = document.getElementById('codeScript')
      if (scriptOld) { scriptOld.remove();}
      var scriptNew   = document.createElement('script');
      scriptNew.id = 'codeScript';
      var cmScript = myCodeMirror.getValue();

      for (var e=0; e< activeEffects.length; e++){
        $("pre:contains('effects."+activeEffects[e]+".amount')")
            .addClass('scrub-'+activeEffects[e]);
        $(".scrub-"+activeEffects[e]).find('.cm-number').attr('id','num-'+activeEffects[e]);
      }

      var matches = document.querySelectorAll(".cm-number");
      var matchIDs = [];
      for (var i = 0; i < matches.length; i++)
      {
        var match = matches[i];
        var matchID = $(match).attr('id');
        matchIDs.push(matchID);
      }
         if (matchIDs.indexOf('num-filmgrain')!=-1){
          cmScript+="\n\ effects.filmgrain.amount = parseInt($('#num-filmgrain').text())/10;";
         } else {
          cmScript+="\n\ effects.filmgrain.amount = 0;";
         }
         if (matchIDs.indexOf('num-blur')!=-1){
          cmScript+="\n\ effects.blur.amount = parseInt($('#num-blur').text())/100;";
         }else {
          cmScript+="\n\ effects.blur.amount = 0;";
         }
        if (matchIDs.indexOf('num-vignette')!=-1){
          cmScript+="\n\ effects.vignette.amount = Math.round(parseInt($('#num-vignette').text()));";
        } else {
          cmScript+="\n\ effects.vignette.amount = 0;";
        }
        if (matchIDs.indexOf('num-exposure')!=-1){
          cmScript+="\n\ effects.exposure.amount = parseInt($('#num-exposure').text())/25;";
        } else {
          cmScript+="\n\ effects.exposure.amount = 0;";
        }
        // if ($(match).attr('id')=='num-hue'){
        //   cmScript+="\n\ effects.hue-saturation.hue = parseInt($('#num-hue').text())/100;";
        // } else if ($(match).attr('id')=='num-saturation'){
        //   cmScript+="\n\ effects.hue-saturation.saturation = parseInt($('#num-saturation').text())/20;";
        // } else if ($(match).attr('id')=='num-tone'){
        //   cmScript+="\n\ effects.tone.toned = parseInt($('#num-tone').text())/10;";
        // }
        if ($(match).attr('id')=='num-noise'){
          cmScript+="\n\ effects.noise.amount = parseInt($('#num-noise').text())/10;";
        } else {
          cmScript+="\n\ effects.noise.amount = 0;";
        }

      scriptNew.text = cmScript;

      if(cmScript.indexOf(20) >= 0 && step2 === 0){
        $('.step1').addClass('is-hidden');
        $('.step2').removeClass('is-hidden');
        step2++;
      }

      var codeContents = $('.cm-property').text();
      if(codeContents.indexOf('pause') >= 0 && step3 === 0 && step2 === 1){
        $('.step2').addClass('is-hidden');
        $('.step3').removeClass('is-hidden');
        step3++;
      }

      var cmProp = $('.cm-' + eff).text();
      if(cmProp.indexOf(eff) >= 0){
      }
      else if(step4 === 0 && step3 === 1){
        $('.step3').addClass('is-hidden');
        $('.step4').removeClass('is-hidden');
        step4++;
      };


      document.body.appendChild(scriptNew);
    }

    $('#reset').click(function (){
      myCodeMirror.setValue(editor_text);
      for (var i=0; i<activeEffects.length; i++) {
        var eff = activeEffects[i];
              $('[name='+eff+']').removeClass("is-active");
      }
    });

    $('.js-close-steps').click(function(){
      $('.step4').addClass('is-hidden');
    });

            function GetScrubVals(){}

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
      if ((valin>=0)&&(valin%20)==0) {GetScrubVals()};
    },

    end : function (element) {
        GetScrubVals();
    }
};

  var timeshasdropped = 0;

    $(".tabs-2").droppable({
        drop: function( event, ui ) {

          if (init_code) { myCodeMirror.setValue(editor_text); myCodeMirror.save();}
          init_code = 0;
          if (timeshasdropped === 0){
            $('.step1').removeClass('is-hidden');
          }
          timeshasdropped++;


          eff = ui.draggable.attr("name");

          $('[name='+eff+']').addClass("is-active");

          myCodeMirror.replaceRange('\n\    effects.'+eff+'.amount = 5;',CodeMirror.Pos(myCodeMirror.lastLine()));
          myCodeMirror.markText({ line: myCodeMirror.lastLine(), ch: 0 }, CodeMirror.Pos(myCodeMirror.lastLine()), { className: "cm-" + eff });
          myCodeMirror.save();
          GetScrubVals();
          $( ".scrub-"+eff).effect("highlight",2000);


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

      eval("effects."+eff+".amount = 0");

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
        $(".uploadform p").text('Video buffering...');
        $.get("/sendVid",function(body){
           movie.src="data:video/mp4;base64,"+body;
           movie.addEventListener("playing", displayVid, false);
        });
        function displayVid(){
        $(".popup").addClass("is-hidden");
        $(".clearHover").addClass("is-hidden");
        $(".buttons").addClass("is-aware");
        $(".runbtn").removeClass("is-hidden");
        $(".video2").removeClass("is-hidden");
        $(".js-appear").removeClass("is-hidden");
        };
             },
       error: function(jqXHR, textStatus, errorThrown){
        $(".uploadform p").text('Video is larger than 10MB. Select a smaller video and try again!');
       }

      });
      e.preventDefault();
    });

    //whammy section
    var canvas = document.getElementById('canvas');
    var rafId;
    var frames = [];
    var CANVAS_WIDTH = 300;
    var CANVAS_HEIGHT = 150;

    function drawVideoFrame(time) {
      rafId = requestAnimationFrame(drawVideoFrame);
      frames.push(canvas.toDataURL('image/webp', 1));
      if (frames.length>=76){
        stop();
      }
    };

    function stop() {
      cancelAnimationFrame(rafId);
      var webmBlob = Whammy.fromImageArray(frames, 1000 / 60);
      video_filtered = webmBlob;
      // console.log(webmBlob.type +' and '+webmBlob.size);
      var video3 = document.createElement('video');
      var url = window.URL.createObjectURL(webmBlob);
      video3.src = url;
      document.body.appendChild(video3);
      video3.play();
      var url = video3.src;
      $('#dLink').attr('href', url);
      $('#export').text('Export video');
      $("body").css("cursor", "auto");
      $("#export").css("cursor", "auto");
      $('#export').attr('disabled',false);
      $('#dLbtn').attr('disabled',false);
      $('#youtube').attr('disabled',false);
    }

    $("#export").click(function(){
          frames=[];
          rafId = requestAnimationFrame(drawVideoFrame);
          $(this).text('Exporting...');
          $("body").css("cursor", "progress");
          $(this).css("cursor","progress");
          $(this).attr('disabled',true);
        });

    $('#youtube').click(function(){
      $('.YouTube').show();
    });

    $(".js-upload-video").click(function(){
        $(".popup").removeClass("is-hidden");
    });
    $(".js-hide-upload").click(function(){
        $(".popup").addClass("is-hidden");
    });

    $(".uploaddemo").click(function(){
        movie.src="/img/demo.mp4";
        $(".popup").addClass("is-hidden");
        $(".buttons").addClass("is-aware");
        $(".clearHover").addClass("is-hidden");
        $(".runbtn").removeClass("is-hidden");
        $(".video2").removeClass("is-hidden");
        $(".js-appear").removeClass("is-hidden");
      });

    $(".runbtn").click(function(){
        $(".video2").removeClass("is-hidden");
        movie.paused ? movie.play() : movie.pause();
    });

    movie.addEventListener('playing',function(){
         $(".runbtn").text('Pause');
    });

    movie.addEventListener('pause',function(){
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
