    var movie = document.getElementById('myvideo');
    var seriously,
    video,
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

  $('.learnMore').hide();

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
      scriptNew.text = myCodeMirror.getValue();
      document.body.appendChild(scriptNew);
    }

            function GetScrubVals(){

                for (var e=0; e< activeEffects.length; e++){
                  $("pre:contains('effects."+activeEffects[e]+".amount')")
                      .addClass('scrub-'+activeEffects[e]);
                  $(".scrub-"+activeEffects[e]).find('.cm-number').attr('id','num-'+activeEffects[e]);
                }

              var matches = document.querySelectorAll(".cm-number");

              for (var i = 0; i < matches.length; i++)
              {
                var match = matches[i];
                new Scrubbing (
                  match, {adapter: VigArr, driver : [ Scrubbing.driver.Mouse,
                   Scrubbing.driver.MouseWheel,
                   Scrubbing.driver.Touch
                   ]});
                 if ($(match).attr('id')=='num-filmgrain'){
                  effects.filmgrain.amount = parseInt($('#num-filmgrain').text())/10;
                 } else if ($(match).attr('id')=='num-blur'){
                  effects.blur.amount = parseInt($('#num-blur').text())/100;
                 }else if ($(match).attr('id')=='num-vignette'){
                  effects.vignette.amount = Math.round(parseInt($('#num-vignette').text()));
                } else if ($(match).attr('id')=='num-exposure'){
                  effects.exposure.amount = parseInt($('#num-exposure').text())/25;
                } else if ($(match).attr('id')=='num-hue'){
                  effects.hue-saturation.hue = parseInt($('#num-hue').text())/100;
                } else if ($(match).attr('id')=='num-saturation'){
                  effects.hue-saturation.saturation = parseInt($('#num-saturation').text())/20;
                } else if ($(match).attr('id')=='num-tone'){
                  effects.tone.toned = parseInt($('#num-tone').text())/10;
                } else if ($(match).attr('id')=='num-noise'){
                  effects.noise.amount = parseInt($('#num-noise').text())/10;
                }
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
      if ((valin>=0)&&(valin%20)==0) {GetScrubVals()};
    },

    end : function (element) {
        GetScrubVals();
    }
};

    $(".tabs-2").droppable({
        drop: function( event, ui ) {

          if (init_code) { myCodeMirror.setValue(editor_text); myCodeMirror.save();}
          init_code = 0;
          var eff = ui.draggable.attr("name");

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


    $(".xbtn").click(function(){
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
        $(".tabs-2").removeClass("hidden");
    });

    $(".tab1").click(function(){
        $(".tabs-1").removeClass("hidden");
        $(".tabs-2").addClass("hidden");
    });

    $(".layer1").click(function(){
        $(".displaysecond").animate({
            "margin-left": 0}, "ease", function(){
                $(".displayfirst").addClass("hidden2");
            });
        $(".tabs-1").removeClass("hidden");
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
        $(".popup").addClass("hidden");
        $(".clearHover").addClass("hidden");
        $(".buttons").addClass("is-aware");
        $(".runbtn").removeClass("hidden");
        $(".video2").removeClass("hidden");
        $(".js-appear").removeClass("hidden");
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
      $('#export').text('Export video');
      $("body").css("cursor", "auto");
      $("#export").css("cursor", "auto");
      $('#export').attr('disabled',false);
      cancelAnimationFrame(rafId);
      var webmBlob = Whammy.fromImageArray(frames, 1000 / 60);
      var video3 = document.createElement('video');
      var url = window.URL.createObjectURL(webmBlob);
      video3.src = url;
      document.body.appendChild(video3);
      video3.play();
      var url = video3.src;
      $('#dLink').attr('href', url);
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

    $(".uploadfirst").click(function(){
        $(".popup").removeClass("hidden");
    });

    $(".uploaddemo").click(function(){
        movie.src="/img/demo.mp4";
        $(".popup").addClass("hidden");
        $(".buttons").addClass("is-aware");
        $(".clearHover").addClass("hidden");
        $(".runbtn").removeClass("hidden");
        $(".video2").removeClass("hidden");
        $(".js-appear").removeClass("hidden");
      });

    $(".runbtn").click(function(){
        $(".video2").removeClass("hidden");
        $(".buttons").addClass("hidden");
        movie.paused ? movie.play() : movie.pause();
    });

    movie.addEventListener('playing',function(){
         $(".runbtn").text('Pause');
    });

    movie.addEventListener('pause',function(){
         $(".runbtn").text('Play');
    });    

    $('.switchlearn').click(function(){
      $('.switchlearn').removeClass('active');
      $('.switcheffect').addClass('active');
      $('.methods').hide();
      $('.learnMore').fadeIn();
    });

    $('.switcheffect').click(function(){
      $('.switcheffect').removeClass('active');
      $('.switchlearn').addClass('active');
      $('.learnMore').hide();
      $('.methods').fadeIn();
    });

    $('.arrowli').click(function(){
      var img = $(this).find("img")
      if( $(this).hasClass('active') ){
        $(this).next().fadeOut();
        $(this).removeClass('active');
        img.attr("src","img/btnright.png");
      }
      else{
        $(this).next().fadeIn();
        $(this).addClass('active');
        img.attr("src","img/btndown.png");
      }
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

    var showInfo = function(term, color){
      $('pre:contains('+term+')').css("background-color", color );
    };

    var removeInfo = function(term){
      $('pre:contains('+term+')').css("background", "none" );
    };


});
