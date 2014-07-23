var movie,
    canvas,
    seriously,
    InitSeriously,
    myCodeMirror,
    video,
    vidLen,
    target,
    effects = {},
    windowObjectReference = null;
var rafId;
var frames = [];
var capture;
var videoDLurl;

var showVid = function() {
  $('.loader').addClass('is-hidden');
  $(".popup").addClass("is-hidden");
  $(".clearHover").addClass("is-hidden");
  $(".buttons").addClass("is-aware");
  $(".runbtn").removeClass("is-hidden");
  $(".video2").removeClass("is-hidden");
  $(".js-appear").removeClass("is-hidden");
  $('.CodeMirror-code').removeClass('is-hidden');
  $('.step0').removeClass('is-hidden');
  labelLines();
  vidLen = Math.round(this.duration);
};

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
  var videoDisplay = document.getElementById('vid-display');
  videoDLurl = window.URL.createObjectURL(webmBlob);
  //videoDL.src = videoDLurl;
  //videoDL.controls = true;
  //videoDL.load();
  videoDisplay.src = videoDLurl;
  videoDisplay.controls = true;
  videoDisplay.load();
  videoDisplay.play();
  $('.displayWait').addClass('is-hidden'); 
  $('.lesson-prompt').text('Looks amazing!');  
  $('.link-two').attr('disabled',false);  
  $('#dLink').attr('href', videoDLurl);
  $('#export').text('Save video');
  $("body").css("cursor", "auto");
  $("#export").css("cursor", "auto");
  $('#export').attr('disabled',false);
  $('#dLbtn').attr('disabled',false);
  $('#youtube').attr('disabled',false);

  $('.dl-progress').text('All Finished!');      
  $('.share-btn').removeClass('is-hidden');
  // windowObjectReference = window.open('/gallery?userVidURL='+videoDLurl,'GalleryPage','resizable,scrollbars');
  //save to AWS S3
  // $.ajax('/awsUpload?userVidURL='+videoDLurl,{
  //   success: function(data, textStatus, jqXHR){
  //     console.log('Successfully uploaded to AWS');
  //   },
  //   error: function(data, textStatus, jqXHR){
  //     console.log('Failed to upload to AWS');
  //   }
  // });
};

$( document ).ready(function() {
  movie = document.getElementById('myvideo');
  canvas = document.getElementById('canvas');

  myCodeMirror = CodeMirror.fromTextArea(document.getElementById('codemirror'),  {
        mode:  "javascript",
        theme: "solarized light",
        lineWrapping: true,
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true
      });
  
  $('.CodeMirror-code').addClass('is-hidden');

  var codeDelay;  
  myCodeMirror.on("change", function() {
            clearTimeout(codeDelay);
            codeDelay = setTimeout(updateScript, 300);
    });
    
  seriously = new Seriously();
  seriously.go();

  var delay=1000//1 seconds
  setTimeout(InitSeriously,delay);      

  // video events section  
  $(".uploadfile").click(function(){
      $('.loader').removeClass('is-hidden');
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
        movie.src="data:video/mp4;base64,"+data;
        movie.addEventListener("loadeddata", showVid, false);
         },
       error: function(jqXHR, textStatus, errorThrown){
        $('.loader').addClass('is-hidden');
        $(".uploadform p").text('Video is larger than 25MB. Select a smaller video and try again!');
       }
     });
    e.preventDefault();
  });

  $(".js-instagram-import").click(function(){
      $('.loader').removeClass('is-hidden');
      $.ajax('/instagram/vid',{
        success: function(data, textStatus, jqXHR){
          movie.src="data:video/mp4;base64,"+data;
          movie.addEventListener("loadeddata", showVid, false);
        },
        error: function(data, textStatus, jqXHR){
          $('.loader').addClass('is-hidden');
          alert("You don't have any Instagram videos :(");
        }
    });
  });

  var rafId;
  var frames = [];
  var capture;
  var videoDLurl;

  movie.addEventListener('playing',function(){
    //also update movie.___() line in code editor
       $(".runbtn").text('Pause');
  });

  movie.addEventListener('pause',function(){
    //also update movie.___() line in code editor
       $(".runbtn").text('Play');
  });    

  // End video events section

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
      $('.loader').addClass('is-hidden');
      $(".popup").addClass("is-hidden");
  });

  $(".js-choose-sample").change(function(){
      var sampleVids = {"origami":"/img/demo.mp4","flower":"/img/wha_color.mp4"};
      var sample = $(this).val();
      if (sample){
        movie.src=sampleVids[sample];
        movie.addEventListener("loadeddata", showVid, false);
      }
    });

  $(".runbtn").click(function(){
      $(".video2").removeClass("is-hidden");
      movie.paused ? movie.play() : movie.pause();
  });

  $('.js-reset-code').click(function (){
    var editor_text = $('textarea').text();
    myCodeMirror.setValue(editor_text);
    for (var i=0; i<allEffects.length; i++) {
      var eff = allEffects[i];
      $('[name='+eff+']').removeClass("is-active");
    }
  });

  $('.js-close-steps').click(function(){
    $('.step4.ch1').addClass('is-hidden');
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

  $('.js-fetch-vid').each(function(){
    //go get video based on # in quadrant
    var thumbnail = $(this);
    var n = thumbnail.attr("name");
    $.ajax('/instagram/'+n,{
        success: function(data, textStatus, jqXHR){
          thumbnail.addEventListener("loadeddata", function(){
            console.log('thumbnail data loaded');
          }, false);         

          thumbnail.attr("src","data:video/mp4;base64,"+data);
        },
        error: function(data, textStatus, jqXHR){
          $('.loader').addClass('is-hidden');
            if (n==0){
              alert("You don't have any Instagram videos :(");            
            }
        }
      })    
  });  

//filters page
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
        labelLines();
        $(".line-"+eff).effect("highlight",2000);
      }
    });

  $('#methodList li').each(function(){
    var e = $(this).attr("name");
    if (e!="sepia") { allEffects.push(e); }
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

//scrubbing page
  
  $('#mouseScrubber').draggable({
      drag: function (event, ui){
          labelLines();
          var x = Math.max(0,ui.position.left/100);
          var y = Math.max(0,ui.position.top/100);
          myCodeMirror.eachLine( function(l){
            var lineNum = myCodeMirror.getLineNumber(l);
            var lineText=l.text;
            if (lineText.indexOf("movie.playbackRate")!=-1) {
              myCodeMirror.replaceRange(" movie.playbackRate = "+x+";", CodeMirror.Pos(lineNum,0), CodeMirror.Pos(lineNum));
              myCodeMirror.markText({ line: myCodeMirror.lastLine(), ch: 0 }, CodeMirror.Pos(myCodeMirror.lastLine()), { className: "cm-speed"});
            }
          });
          myCodeMirror.save();
          labelLines();
          $(".line-speed").effect("highlight",2000);
      }
    });

});
