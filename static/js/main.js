var movie,
    canvas,
    seriously,
    InitSeriously,
    myCodeMirror,
    video,
    vidLen,
    target,
    effects = {},
    rafId,
    frames = [],
    capture,
    videoDLurl,
    videoDisplay,
    windowObjectReference = null;

var showVid = function() {
  $('.vid-placeholder').addClass('is-hidden');
  $('.js-activate-btn').addClass('is-hidden');
  $('.js-slide-right-final').removeClass('is-hidden');
  $('.loader').addClass('is-hidden');
  $(".popup").addClass("is-hidden");
  $(".clearHover").addClass("is-hidden");
  $(".buttons").addClass("is-aware");
  $(".runbtn").removeClass("is-hidden");
  $(".video2").removeClass("is-hidden");
  $(".js-appear").removeClass("is-hidden");
  $(".js-switch-appear").addClass("is-hidden");
  $('.CodeMirror-code').removeClass('is-hidden');
  $('.step0').removeClass('is-hidden');
  labelLines();
  vidLen = Math.round(this.duration);
};

//account for different browsers with requestAnimationFrame
var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;

function drawVideoFrame(time) {
  rafId = requestAnimationFrame(drawVideoFrame);
  capture = frames.length*60/1000;
  captureTxt = Math.floor(100*capture/vidLen)+'%';
  $('.dl-progress').css('width',captureTxt);
  $('.dl-progress').text('saving...');
  frames.push(canvas.toDataURL('image/webp', 1));
  if (capture>=vidLen){ stopDL();}
};

function stopDL() {
  cancelAnimationFrame(rafId);
  $('.progressDiv').addClass('is-hidden');
  var webmBlob = Whammy.fromImageArray(frames, 1000 / 60);
  //save the video + title + desc
  submitVideo(webmBlob);
}

var uploadFromComp = function (ev) {
  $('.loader').removeClass('is-hidden');
  var file = ev.target.files[0];
  var maxSize = 10000000;
  var exts = ['.mp4','.webm'];
  var reader = new FileReader();
  reader.onload = (function(theFile) {
    return function(e) {
      var fileName = file.name;
      var i = fileName.lastIndexOf('.');
      var ext = (i < 0) ? '' : fileName.substr(i);
      var ext = ext.toLowerCase();

      if ( ( file.size < maxSize ) && ( exts.indexOf(ext) != -1 ) ) {
        movie.addEventListener("loadeddata", showVid, false);
        movie.src = e.target.result;
        $(".uploadform p").text("");
      } else {
        $('.loader').addClass('is-hidden');
        $(".uploadform p").text("Video must be smaller than 10MB and a '.mp4' or '.webm' file. Select a different video and try again!");
      }
    };
  })(file);

  reader.readAsDataURL(file);
}

var submitVideo = function (blob) {
  var formData = new FormData();
  //append input #formTitle #formDesc
  formData.append('title', $(".kaytitle").text());
  formData.append('desc', $(".kaydesc").text());
  formData.append('video',blob);
  $.ajax({
    url: '/uploadFinished',
    type: 'POST',
    data:  formData,
    mimeType:"multipart/form-data",
    contentType: false,
    cache: false,
    processData:false,
    success: function(token, textStatus, jqXHR){
      videoDLurl = window.URL.createObjectURL(blob);
      videoDisplay.src = videoDLurl;
      videoDisplay.controls = true;
      $('.js-share').attr('href','/share/'+token);
  	},
  	error: function(jqXHR, textStatus, errorThrown){
  	}
   });
}

$( document ).ready(function() {
  movie = document.getElementById('myvideo');
  canvas = document.getElementById('canvas');
  videoDisplay = document.getElementById('vid-display');
  inputFile = document.getElementById('inputFile');
  seriously = new Seriously();
  seriously.go();
  movie.addEventListener('canplay',InitSeriously, false);
  movie.load();
  videoDisplay.addEventListener('loadeddata', function(){
    $('.js-share').removeClass('is-inactive-btn');
    $('.share-p-text-container').removeClass('is-hidden');
    $('.js-lesson-prompt').text('Looks amazing!');
  }, false);

  inputFile.addEventListener('change',uploadFromComp, false);

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


  // video events section

  movie.addEventListener('playing',function(){
    //also update movie.___() line in code editor
    $( "pre:contains('movie.pause')" ).html('<span class="cm-variable">movie</span>.<span class="cm-property">play</span>();');
    $(".runbtn").text('Pause');
  });

  movie.addEventListener('pause',function(){
    //also update movie.___() line in code editor
    $( "pre:contains('movie.play')" ).html('<span class="cm-variable">movie</span>.<span class="cm-property">pause</span>();');
    $(".runbtn").text('Play');
  });

  // End video events section

  $(".js-upload-video").click(function(){
    $(".popup").removeClass("is-hidden");
  });

  $(".js-hide-upload").click(function(){
    $('.loader').addClass('is-hidden');
    $(".popup").addClass("is-hidden");
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




//filters page
  //checks for current status of buttons, for lesson steps
  var timeshasdropped = 0;

  $(".tabs-2").droppable({
    drop: function( event, ui ) {

      lessonIsActive(".js-effects");

      //lesson steps---
      if (timeshasdropped === 0){
        $('.step0.ch1').addClass('is-hidden');
        $('.step1.ch1').removeClass('is-hidden');
      }
      timeshasdropped++;
      //---

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
        }
      } else {
        myCodeMirror.replaceRange('\n\ effects.'+eff+';',CodeMirror.Pos(myCodeMirror.lastLine()));
        myCodeMirror.markText({ line: myCodeMirror.lastLine(), ch: 0 }, CodeMirror.Pos(myCodeMirror.lastLine()), { className: "cm-" + eff });
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
    $(this).removeClass("is-active");
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


  var lessonIsActive = function(newLesson){
    $(newLesson).show();
    $(newLesson).animate({
      margin: "0px"
    }, 350);
  }


  //hover state of learn more section

  $('.js-values').hover(function(){
    showInfo("amount", "rgba(103, 121, 198, .4)");
    showInfo('"', "rgba(103, 121, 198, .4)");
  }, function(){
    removeInfo("amount");
    removeInfo('"');
  });

  $('.js-boolean').hover(function(){
    showInfo("true", "rgba(103, 121, 198, .4)");
    showInfo("false", "rgba(103, 121, 198, .4)");
  }, function(){
    removeInfo("true");
    removeInfo("false");
  });


  $('.js-object').hover(function(){
    showInfo("movie", "rgba(49, 150, 101, .4)");
    showInfo("effects", "rgba(49, 150, 101, .4)");
  }, function(){
    removeInfo("movie");
    removeInfo("effects");
  });
  $('.js-movie').hover(function(){
    showInfo("movie", "rgba(49, 150, 101, .4)");
  }, function(){
    removeInfo("movie");
  });



  $('.js-effects').hover(function(){
    showInfo("effects", "rgba(49, 150, 101, .4)");
  }, function(){
    removeInfo("effects");
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
    showInfo("play", "rgba(118, 70, 130, 0.4)");
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
