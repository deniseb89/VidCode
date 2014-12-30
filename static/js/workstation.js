var movie,
    canvas,
    seriously,
    InitSeriously,
    myCodeMirror,
    video,
    vidLen,
    target,
    seriouslyEffects,
    effects = {},
    rafId,
    frames = [],
    capture,
    windowObjectReference = null;
    numVidSelect = 0;
    allEffects = ['blur','noise','vignette','exposure','fader','kaleidoscope', 'saturation'];
    mult = {'blur':.01, 'noise':.1, 'vignette': 1, 'exposure':.04,'fader':.04, 'kaleidoscope':1, 'saturation':.1};
    defaultValue =  {'number':5 , 'color': '"red"'};

var showVid = function() {
  numVidSelect++;
  $('.vid-placeholder').addClass('is-hidden');
  $('.loader').addClass('is-hidden');
  $(".popup").addClass("is-hidden");
  $(".clearHover").addClass("is-hidden");
  $(".buttons").addClass("is-aware");
  $(".runbtn").removeClass("is-hidden");
  $(".video2").removeClass("is-hidden");
  $('.CodeMirror-code').removeClass('is-hidden');
  activateEndButtons('save');
  activateEndButtons('share');
  labelLines();
  vidLen = Math.round(this.duration);
};

var activateEndButtons = function(bType){
  $('.inactive-js-' + bType + '-m').addClass('js-' + bType + '-m');
  $('.inactive-js-' + bType + '-m').removeClass('inactive-b-a-btn');
  $('.inactive-js-' + bType + '-m').removeClass('inactive-js-' + bType + '-m');
};

//account for different browsers with requestAnimationFrame
var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

var drawVideoFrame = function(time) {
  rafId = requestAnimationFrame(drawVideoFrame);
  capture = frames.length*60/1000;
  captureTxt = Math.floor(100*capture/vidLen)+'%';
  $('.dl-progress').css('width',captureTxt);
  $('.dl-progress').text('saving...');
  frames.push(canvas.toDataURL('image/webp', 1));
  if (capture>=vidLen){ stopDL();}
};

var stopDL = function() {
  $('.progressDiv').addClass('is-hidden');
  cancelAnimationFrame(rafId);
  var webmBlob = Whammy.fromImageArray(frames, 1000 / 60);
  submitVideo(webmBlob);
};

var submitVideo = function (blob) {
  var formData = new FormData();
  //append input #formTitle #formDesc
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
      $('.progressDiv').addClass('is-hidden');
      $('.share-p-text-container').removeClass('is-hidden');
      $('.js-lesson-prompt').text('Looks amazing!');
      $('.js-h-onload').addClass('is-hidden');
      $('.js-s-onload').removeClass('is-hidden');
      $('.js-share').removeClass('is-inactive-btn');
      $('.js-share').attr('href','/share/'+token);
      $('.js-share-link-to-copy').val(window.location.host+'/share/'+token);
      //$('meta[property=og\\:url]').attr('content', window.location.host+'/share/'+token);
      window.history.pushState("Share", "Share Your Video", '/share/'+token);
      addthis.layers.refresh();
    },
    error: function(jqXHR, textStatus, errorThrown){
    }
  });
};

var uploadFromComp = function (ev) {
  var files = ev.target.files;
  var maxSize = 10000000;

  //TODO: implement multiple file upload on the server

  for (var i=0; i<files.length; i++){
    var file = files[i];
    var reader = new FileReader();

    reader.onload = (function(theFile) {
      return function(e) {
        if ( file.size < maxSize ) {
          // var formData = new FormData();
          // formData.append('file',file);
          // $.ajax({
          //   url: '/uploadMedia',
          //   type: 'POST',
          //   data:  formData,
          //   mimeType:"multipart/form-data",
          //   contentType: false,
          //   cache: false,
          //   processData:false,
          //   success: function(data, textStatus, jqXHR){
          //     var data = JSON.parse(data);
              updateMediaLibrary(file,e.target.result);
              $(".popup").addClass("is-hidden");
              $(".fileError").text("");            
          //   },
          //   error: function(file, textStatus, jqXHR){
          //     console.log('file error');
          //   }
          // });    
          } else {
          $('.loader').addClass('is-hidden');
          $(".fileError").text("Videos and images must be smaller than 10MB. Select a different file and try again!");
        }
      };
    })(file);

    reader.readAsDataURL(file); 
  }
};

var updateMediaLibrary = function (file,data){
  //create div and img/video tags
    var type;
    var style;
    var fn;
    if ( file.type.match(/image.*/) ){
      type = 'img';
      style = 'js-img-click';
      fn = function() {
        $(this).toggleClass('js-selected-video');
        $(this).toggleClass('js-selected-still');
        //update frame array with stills. Maybe add some kind of enumeration to the frames
        movie.src = "";
        showVid();
        var stills = document.querySelectorAll('.js-selected-still');
        var frameArr = new Array(stills.length);
        for (var i=1; i<=frameArr.length; i++){
          frameArr[i-1]=i; 
        }
        frameArr.join(",");
        myCodeMirror.replaceRange('\n\ stopMotion.frames = ['+frameArr+'];',CodeMirror.Pos(myCodeMirror.lastLine())); 
        myCodeMirror.markText({ line: myCodeMirror.lastLine(), ch: 0 }, CodeMirror.Pos(myCodeMirror.lastLine()), { className: "cm-frames" });

      };  
    } else if (file.type.match(/video.*/) ) {
      type = 'video';
      style = 'js-vid-click';
      fn = function() {
        $('.loader').removeClass('is-hidden');
        $('.js-vid-click').removeClass('js-selected-video');
        $(this).addClass('js-selected-video');
        movie.addEventListener("loadeddata", showVid, false);
        var thisSrc = $(this).attr('src');
        movie.src = thisSrc;        
      };
    }

    var div = document.createElement('div');
    div.className += 'i-vid-container';
    var media = document.createElement(type);
    media.className += style;
    media.src = data;    
    media.addEventListener('click',fn,false);
    div.appendChild(media);
    document.getElementById('media-library').appendChild(div);
};

/*old filters.js*/
var labelLines = function() {
  //this function should take an input for the relevant effect, not brute force for all
  for (var e=0; e< allEffects.length; e++){
    $("pre:contains('effects."+allEffects[e]+"')").addClass('active-effect');
    $("pre:contains('effects."+allEffects[e]+"')").attr('name',allEffects[e]);
  }
};

var setup = function(){
   //check Seriously compatibility
  if (Seriously.incompatible() || !Modernizr.webaudio || !Modernizr.csstransforms) {
    $('.compatibility-error').removeClass('is-hidden');
  } else {
    $("#joyRideTipContent").joyride({
      autoStart: true
    });
    InitSeriously();
  }  
  movie.removeEventListener('canplay', setup, false);
}

var InitSeriously = function(){
  //TODO: generalize to my media
  video = seriously.source('#myvideo');
  target = seriously.target('#canvas');

  //Set up Seriously.js effects
  var thisEffect;
  seriouslyEffects = Seriously.effects();
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

  /*TODO: Check to see if the active effects have changed from before to now
  if so, reinit seriously. if not, do nothing
  Also, don't add and remove the script each time. Just update the script string via innerhtml
  */

  // if (textScript.indexOf('effects.sepia')>=0) {
  //   if (allEffects.indexOf('sepia')<0) {
  //     allEffects.push('sepia');
  //     InitSeriously();
  //   }
  // } else {
  //   var si = allEffects.indexOf('sepia');
  //   if (si>=0) {
  //     allEffects.splice(si,1);
  //     InitSeriously();
  //   }
  // }

  if (textScript.indexOf('stopMotion.interval')>=0) {
    // if (!stopMotion.on) {
      stopMotion.start();
    // }
  } else {
    if (stopMotion.on) {
      stopMotion.stop();
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
};

var checkBtnStatus = function(effect) {
  //compare the names of effect buttons to the names in activeEffects
  var effectName = $(effect).attr("name");
  $('li[name=' + effectName + ']').addClass("is-active")
};

/*old lessons.js*/

var loadThumbnails = function() {
  var social = $('#social').text();

  if (social=="instagram"){
    $.ajax('/instagramVids',{
      success: function(data, textStatus, jqXHR){
        var igVids = data;
        if (igVids.length){
          for (var i=0; i < Math.min(igVids.length,3); i++){
            $('#js-fetch-vid'+i).error(function(){
              $(this).addClass('is-hidden');              
            });
            $('#js-fetch-vid'+i).removeClass('is-hidden');
            document.getElementById('js-fetch-vid'+i).src = '/instagram/'+i;
            document.getElementById('js-fetch-vid'+i).addEventListener("loadeddata", function(){
            }, false);
          }
        } else {
          $('.i-error').text("You don't have any Instagram videos :(");          
        }
      },
      error: function(data, textStatus, jqXHR){
        $('.i-error').text("Uh oh. Your Instagram videos aren't loading. Try refreshing the page to fix it.");          
      }
    });
  } else {
    $('.insta-import').removeClass('is-hidden');
  }
};

var slideLeft = function(oldSlide, newSlide){
  $(newSlide).addClass('is-hidden');
  $(oldSlide).removeClass('is-hidden');
  $(oldSlide).animate({
    opacity: 1,
    'margin-left': "0px"
    });
};

var slideRight = function(oldSlide, newSlide){
  $(oldSlide).animate({
    'margin-left': "-200px",
    opacity: 0
    }, function() {
      $(oldSlide).addClass('is-hidden');
    });
  setTimeout(function(){
    $(newSlide).removeClass('is-hidden');
  }, 500);
};

$( document ).ready(function() {
  movie = document.getElementById('myvideo');
  canvas = document.getElementById('canvas');
  inputFile = document.getElementById('inputFile');
  seriously = new Seriously();
  seriously.go();
  movie.addEventListener('canplay', setup, false);
  movie.load();

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

  //share success on copy click
  $('.js-copy-sucess').click(function(){
    $(this).text('✓');
  });


  // video events section

  movie.addEventListener('playing',function(){
    //also update movie.___() line in code editor
    $( "pre:contains('movie.pause()')" ).html('<span class="cm-variable">movie</span>.<span class="cm-property">play</span>();');
    $(".runbtn").text('Pause');
  });

  movie.addEventListener('pause',function(){
    //also update movie.___() line in code editor
    $( "pre:contains('movie.play()')" ).html('<span class="cm-variable">movie</span>.<span class="cm-property">pause</span>();');
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
    $('.methodList').removeClass('is-hidden');
    movie.playbackRate = 1;
  });

  $('.save-btns-container').on('click', ".js-share-m", function(){
    modalVideoLoad('share');
  });

  $('.save-btns-container').on('click', ".js-save-m", function(){
    modalVideoLoad('save');
  });


  var modalVideoLoad = function(mname){
    addThisStyles();

    $('.' + mname + '-modal').removeClass('is-hidden');
    $('.cover50').removeClass('is-hidden');
    $('.progressDiv').removeClass('is-hidden');
    frames=[];
    rafId = requestAnimationFrame(drawVideoFrame);
  }

  $('.js-hide-a-m').click(function(){
    $('.share-modal').addClass('is-hidden');
    $('.save-modal').addClass('is-hidden');
    $(this).addClass('is-hidden');
    $('.js-s-onload').addClass('is-hidden');
    $('.js-h-onload').removeClass('is-hidden');
    $('.dl-progress').css('width','1px');
  });

  //addthis functionality and appearance
  var addThisStyles = function(){
    $('.at15t_facebook').attr('id', 'fb-btn-styling');
    $('.at15t_facebook').html('<img src="/img/icons/fb-icon.png"> share with facebook');
    $('.at15t_twitter').attr('id', 'tw-btn-styling');
    $('.at15t_twitter').html('<img src="/img/icons/tw-icon.png"> share with twitter');
  }

  $(".tabs-2").droppable({
    drop: function( event, ui ) {

      lessonIsActive(".js-effects");

      var eff = ui.draggable.attr("name");
      $('[name='+eff+']').addClass("is-active");
      var filter = seriouslyEffects[eff];
      if (filter) {
        var input;
        for (var i in filter.inputs) {
          input = filter.inputs[i];
          if( (i != 'source') || (i === 'time' || i === 'timer') ){
            lineText = '\n\ effects.'+eff+'.'+i+' = '+defaultValue[input.type]+';';
            myCodeMirror.replaceRange(lineText,CodeMirror.Pos(myCodeMirror.lastLine()));
            myCodeMirror.markText({ line: myCodeMirror.lastLine(), ch: 0 }, CodeMirror.Pos(myCodeMirror.lastLine()), { className: "cm-" + eff });
          }
        }
      } else if (eff=="play"){
          myCodeMirror.replaceRange('\n\ movie.'+eff+'();',CodeMirror.Pos(myCodeMirror.lastLine()));
          myCodeMirror.markText({ line: myCodeMirror.lastLine(), ch: 0 }, CodeMirror.Pos(myCodeMirror.lastLine()), { className: "cm-" + eff });
      } else if (eff=="pause"){
          myCodeMirror.replaceRange('\n\ movie.'+eff+'();',CodeMirror.Pos(myCodeMirror.lastLine()));
          myCodeMirror.markText({ line: myCodeMirror.lastLine(), ch: 0 }, CodeMirror.Pos(myCodeMirror.lastLine()), { className: "cm-" + eff });
      } else if (eff=="playbackRate"){
          myCodeMirror.replaceRange('\n\ movie.'+eff+' = 1.0;',CodeMirror.Pos(myCodeMirror.lastLine()));
          myCodeMirror.markText({ line: myCodeMirror.lastLine(), ch: 0 }, CodeMirror.Pos(myCodeMirror.lastLine()), { className: "cm-" + eff });
      } else if ( stopMotion.controls.hasOwnProperty(eff) ){
          myCodeMirror.replaceRange('\n\ stopMotion.'+eff+' = '+stopMotion.controls[eff]+';',CodeMirror.Pos(myCodeMirror.lastLine()));
          myCodeMirror.markText({ line: myCodeMirror.lastLine(), ch: 0 }, CodeMirror.Pos(myCodeMirror.lastLine()), { className: "cm-" + eff });
      }

      myCodeMirror.save();
      $(".line-"+eff).effect("highlight",2000);
    }
  });

  $('.methodList li').each(function(){
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

  var lessonIsActive = function(newLesson){
    $(newLesson).show();
    $(newLesson).animate({
      margin: "0px"
    }, 350);
  };

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

  $(".js-desc").click(function() {
      $('.share-p-text-container').removeClass('is-hidden');
      var buttonTitle = document.getElementById("formTitle").value;
      $(".kaytitle").text(buttonTitle);
      var buttonDesc = document.getElementById("formDesc").value;
      $(".kaydesc").text(buttonDesc);
      //resend form here if title/desc is updated      
  });

  loadThumbnails();

  $('.js-img-click').click(function(){
    $(this).addClass('js-selected-video');
    $(this).addClass('js-selected-still');
  });

  $('.js-vid-click').click(function(){
    $('.loader').removeClass('is-hidden');
    $('.js-vid-click').removeClass('js-selected-video');
    $(this).addClass('js-selected-video');
    movie.addEventListener("loadeddata", showVid, false);
    var thisSrc = $(this).attr('src');
    movie.src = thisSrc;
  });


//sliding functionality that we have to get rid of

  $('.js-slide-right-final').click(function(){
    slideRight('.js-slide-1', '.js-slide-title');
    movie.play();
    movie.muted = true;
    $('.js-share').attr('href','#');    
    $('.js-share').addClass('is-inactive-btn');    
    $('.js-lesson-prompt').text('');    
    $('#vid-display').addClass('is-hidden');
    $('.progressDiv').removeClass('is-hidden');
    frames=[];
    rafId = requestAnimationFrame(drawVideoFrame);
  });

  $('.js-slide-left-title').click(function(){
    movie.muted = false;  
    slideLeft('.js-slide-1', '.js-slide-title');
  });

  $('.js-slide-left-first').click(function(){
    slideLeft('.js-slide-title', '.js-slide-final');
  });

  $('.js-switch-videos').click(function(){
    $('.methodsBox').addClass('is-hidden');
    $(".js-switch-appear").removeClass("is-hidden");
  });

  //Switch between content
  $('.js-switch-view').click(function(){
    //Todo: Template these
    var view = ($(this).attr('id'));
    $('.basic-filter-method').addClass('is-hidden');
    $('.adv-filter-method').addClass('is-hidden');
    $('.movie-control-method').addClass('is-hidden');    
    $('.stop-motion-method').addClass('is-hidden');
    $('.'+view).removeClass('is-hidden');
  })

  //boolean game
  var fclicks = 0;
  $('.js-f-b-click').click(function(){
    $(this).fadeOut('fast');
    if($('.js-bool-switch').hasClass('is-showing-true')){
      $('.js-bool-switch').removeClass('is-showing-true');
      $('.js-bool-switch').addClass('is-showing-false');
      $('.js-bool-switch').text('False');
      fclicks++
    }
    else{
      $('.js-bool-switch').removeClass('is-showing-false');
      $('.js-bool-switch').addClass('is-showing-true');
      $('.js-bool-switch').text('True');
      fclicks++
      if(fclicks === 8){
        fclicks = 0;
        $('.js-f-b-click').fadeIn();
      }
    }

  });

//MixPanel Tracking for Learn More

$('.learning-pop-container').click(function(){
  var LM_targets = {
    '#lesson-1-222': '1. What are we writing?',
    '#lesson-2-222':'2. How is it changing my video?',
    '#lesson-3-222':'3. Pieces of our code',
    '#lesson-4-222': '4. Values: An Overview',
    '#lesson-4-2-222': '4a. Types of Values',
    '#lesson-4-3-222': '4b. Booleans',
    '#lesson-objects-222': '5. Objects!',
    "#effects222": '5b. Effects'
  }

  var clicked = $(this).attr('data-target');
  if (clicked) {
    mixpanel.track('LM '+LM_targets[clicked]+' clicked');
  }
});

$('.learning-pop-link').click(function(){
  var LM_targets = {
    '#movies222': '5a. Movie',
    '#function222': '6. Functions!',
    '#play222': '6a. Play'
  }
  var clicked = $(this).attr('data-target');
  if (clicked) {
    mixpanel.track('LM '+LM_targets[clicked]+' clicked');
  }
});