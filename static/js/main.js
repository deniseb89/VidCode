
$( document ).ready(function() {

  $('.learnMore').hide();

    var delay=1000//1 seconds
    setTimeout(function(){
    var media = document.getElementById('myvideo'),
    init_code = 1,

    effects = {};
    activeEffects = ["filmgrain","blur","vignette","noise","exposure"];
    var seriously = new Seriously();
    var video = seriously.source("#myvideo");
    var target = seriously.target('#canvas');
    effects[activeEffects[0]]=seriously.effect(activeEffects[0]);
    eval("effects."+activeEffects[0]+".source = video");
    for (var i=1;i<activeEffects.length;i++){
      effects[activeEffects[i]]=seriously.effect(activeEffects[i]);
      eval("effects."+activeEffects[i]+".source = effects."+activeEffects[i-1]);
    }
      effects.filmgrain.amount = effects.blur.amount = effects.vignette.amount = effects.exposure.exposure = effects.noise.amount = 0;
    eval("target.source = effects."+activeEffects[activeEffects.length-1]);
    seriously.go();

   $(".runbtn").text(media.paused ? "Play" : "Pause");

        var editor_text =
"\
  \n\
  function showEffect() {\n\
    movie.play();\n\
  }\n\
  \n\
  effects = {\n\
      blur: seriously.effect('blur'),\n\
      vignette: seriously.effect('vignette'),\n\
      filmgrain: seriously.effect('filmgrain'),\n\
      vignette: seriously.effect('noise'),\n\
      filmgrain: seriously.effect('exposure')\n\
      };\n\
    ";

            var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('codemirror'),  {
                  mode:  "javascript",
                  theme: "solarized light",
                  readOnly: true,
                  lineWrapping: true,
                  lineNumbers: true
                });

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
                  effects.exposure.exposure = parseInt($('#num-exposure').text())/25;
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


 $("#image").hover($('#greeting').modal());

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
      eval("effects."+eff+".amount = 0");
      eval("effects."+eff+".exposure = 0"); 

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
        $.get("/sendVid",function(body){
           media.src="data:video/mp4;base64,"+body;
           media.addEventListener("playing", displayVid, false);
        });
        function displayVid(){   
        $(".popup").addClass("hidden");
        $(".uploadfirst").addClass("hidden");
        $(".clearHover").addClass("hidden");
        $(".buttons").addClass("hidden");
        $(".runbtn").removeClass("hidden");
        $(".video2").removeClass("hidden");
        };
             },
       error: function(jqXHR, textStatus, errorThrown){
        $(".uploadform p").text(errorThrown);
       }

      });
      e.preventDefault();
    });

    $(".uploadfirst").click(function(){
        $(".popup").removeClass("hidden");
    });

    $(".uploaddemo").click(function(){
        media.src="/img/demo.mp4";
        $(".popup").addClass("hidden");      
        $(".uploadfirst").addClass("hidden");
        $(".clearHover").addClass("hidden");
        $(".buttons").addClass("hidden");
        $(".runbtn").removeClass("hidden");
        $(".video2").removeClass("hidden");

      });

    $(".runbtn").click(function(){
        $(".video2").removeClass("hidden");
        $(".buttons").addClass("hidden");
         if (media.paused) {
          media.play();
          $(this).text('Pause');
        } else {
          media.pause();
          $(this).text('Play');
      }
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
    GetScrubVals();
       },delay)


    //Homepage where you pick your selection of filters
    $('.filterSelect').click(function(){
      var id = $(this).attr('id');
      if ($(this).hasClass('active')){
        $(this).removeClass('active');
        $('.formNext input[value='+id+']').remove();
      }
      else{
        $(this).addClass('active');
        $('.formNext').append("<input type='hidden' name='filter' value='"+id+"' />");
      }
      }) ;

    
    //hover state of learn more section
    $('.object').hover(function(){
      $('pre:contains("movie")').css("background-color", "rgba(49, 150, 101, .4)" );
    }, function(){
      $('pre:contains("movie")').css("background", "none" );
    });
    $('.movie').hover(function(){
      $('pre:contains("movie")').css("background-color", "rgba(49, 150, 101, .4)" );
    }, function(){
      $('pre:contains("movie")').css("background", "none" );
    });
    $('.effects').hover(function(){
      $('pre:contains("effect")').css("background-color", "rgba(49, 150, 101, .4)" );
    }, function(){
      $('pre:contains("effect")').css("background", "none" );
    });
    $('.filmgrain').hover(function(){
      $('pre:contains("filmgrain")').css("background-color", "rgba(49, 150, 101, .4)" );
    }, function(){
      $('pre:contains("filmgrain")').css("background", "none" );
    });
    $('.functions').hover(function(){
      $('pre:contains("function")').css("background-color", "rgba(221, 57, 169, .4)" );
    }, function(){
      $('pre:contains("function")').css("background", "none" );
    });
    $('.showeffect').hover(function(){
      $('pre:contains("showEffect")').css("background-color", "rgba(221, 57, 169, .4)" );
    }, function(){
      $('pre:contains("showEffect")').css("background", "none" );
    });
    $('.play').hover(function(){
      $('pre:contains("play")').css("background-color", "rgba(50, 98, 234, 0.4)" );
    }, function(){
      $('pre:contains("play")').css("background", "none" );
    });
    $('.interval').hover(function(){
      $('pre:contains("interval")').css("background-color", "rgba(50, 98, 234, 0.4)" );
    }, function(){
      $('pre:contains("interval")').css("background", "none" );
    });
});
