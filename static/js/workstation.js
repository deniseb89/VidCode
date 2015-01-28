var movie,
    canvas,
    camera,
    cameraVideo,
	seriously,
    myCodeMirror,
    video,
    vidLen,
    target,
    blend,
	graphic,
	seriouslyEffects,
	webmBlob,
    effects = {},
    rafId,
    frames = [],
    capture,
    windowObjectReference = null;
    numVidSelect = 0;
    numFilterSelect = 0;
    allEffects = ['blend','blur', 'noise', 'vignette', 'exposure', 'fader', 'kaleidoscope'];
    mult = {'blur': .01, 'noise': .1, 'vignette': 1, 'exposure': .04, 'fader': .04, 'kaleidoscope': 1, 'saturation': .1};
    defaultValue = {'number': 5, 'color': '"red"'};
    last_lessonId = '1-1';
    newSession = true;

var checkWebGL = function () {
    //check Seriously compatibility
    if (Seriously.incompatible() || !Modernizr.webaudio || !Modernizr.csstransforms) {
        $('.compatibility-error').removeClass('is-hidden');
    } else {
    	$('.filter-method').removeClass('is-hidden');
    }
};

//activateSession will fire one time only upon having a video playing
//in a new session, this will happen manually upon selecting a video
//in a saved session, this will happen automatically
var activateSession = function () {
	newSession = $('.is-new-session').text();
	InitSeriously();
    if (newSession==="false"){
        var code =  myCodeMirror.getValue();
    } else {
        var code = " movie.play();";
        createCodeInEditor(code, "cm-play");
    }
    updateScript(code);

    $('.vid-placeholder').addClass('is-hidden');
    $('.loader').addClass('is-hidden');
    $(".clearHover").addClass("is-hidden");
    $(".buttons").addClass("is-aware");
    $(".runbtn").removeClass("is-hidden");
    $(".video2").removeClass("is-hidden");
    $("#supportCanvas").removeClass("is-hidden");
    adjustCanvasHeight();

    activateEndButtons('save');
    activateEndButtons('save-code');
    activateEndButtons('share');
    updateLearnMore(2, "<p>You just made a video play with CODE! Your code is now populating the <strong>'text editor'</strong> which speaks to the rest of the computer program and tells it what to do!</p><p>Go ahead and <strong>drag over a filter button on the bottom left.</strong> Tell that computer who's boss!</p>", 'Awesome!', '');
    movie.addEventListener("loadeddata", changeSrc, false);
    movie.removeEventListener("canplay", activateSession, false);
    vidLen = Math.round(movie.duration);
    newSession = false;
};

var InitSeriously = function () {
    seriously = new Seriously();

	//TODO: generalize to my media
   
    video = seriously.transform('reformat');
    video.width = 420;
    video.height = 250;
    video.mode = 'contain';   
    video.source = movie;

    target = seriously.target('#canvas'); 
    graphic = seriously.source(graphicsCanvas);   
    camera = seriously.source(cameraCanvas);

    //Set up Seriously.js effects
    seriouslyEffects = Seriously.effects();
    
    var thisEffect;
    effects[allEffects[0]] = thisEffect = seriously.effect(allEffects[0]);
    thisEffect.top = graphic;
    thisEffect.bottom = video;
  
    for (var i=1;i<allEffects.length;i++){
        effects[allEffects[i]]= thisEffect = seriously.effect(allEffects[i]);
        effects[allEffects[i]]["source"] = effects[allEffects[i-1]];
        thisEffect.amount = 0;
    } 
  
    target.source = effects[allEffects[allEffects.length-1]];
    seriously.go();    
};

var changeSrc = function () {
    numVidSelect++;
    $('.loader').addClass('is-hidden');
    $(".popup").addClass("is-hidden");

    labelLines();
    if (this.tagName=='VIDEO') {
            video = null;
            video = seriously.transform('reformat');
            video.width = 420;
            video.height = 250;
            video.mode = 'contain';   
            video.source = movie;
            effects[allEffects[0]]["bottom"] = seriously.source(video);  
            vidLen = Math.round(this.duration); 
      } else {
        vidLen = 10; //arbitrarily make the stop-motion video length 10 seconds
        movie.src = "";
    }
};


var imgClickSetup = function () {
    changeSrc();
    updateLearnMore(2, '<p>Drag in the <strong>"frames"</strong> button. Select your favorite stills. Now, drag over the <strong>"Interval" button</strong> into the code editor.</p>', 'Upload Stills', '<img class="lessonImg" src="/img/lessons/lesson-stop-motion.png">');
    $(this).toggleClass('js-selected-video');
    $(this).toggleClass('js-selected-still');

    //generalize this somewhere else so when source changes, target changes
    if (!stopMotion.on) changeUniqueSrc(this);

    var selectedStills = document.querySelectorAll('.js-selected-still');

    var newFrames = [];   
    for (var i=0; i<stopMotion.frames.length; i++){
      var frameIsSelected = false;

      for(var j = 0; j < selectedStills.length; j++){
        if(selectedStills[j].id == stopMotion.frames[i]) frameIsSelected = true;    
      }  

      if (frameIsSelected) newFrames.push(stopMotion.frames[i]);
    }
    
    if($(this).hasClass('js-selected-still')){
        newFrames.push(this.id);
        createStopMotionInEditor("frames");
    }  

    var framesString = "";
    newFrames.forEach(function(e, index){
        if(index == newFrames.length-1) framesString = framesString+"'"+e+"'";
        else framesString = framesString+"'"+e+"',";

   });

    var allTM = myCodeMirror.getAllMarks();
    for (var m=0; m<allTM.length; m++){
      var tm = allTM[m];
      if (tm.className=="cm-frames"){
        var cmLine = tm.find();
        updateCodeInEditor(' stopMotion.frames = ['+framesString+'];', cmLine.to.line, "cm-frames");

        if(!newFrames.length) myCodeMirror.removeLine(cmLine.to.line);
      }
    } 
};


var graphClickSetup = function () {
        //if graphic is not selected already, remove previous one
        if($(this).hasClass('js-selected-graphic') === false){
            $('.js-graph-click').removeClass('js-selected-graphic'); 
        }
         $(this).toggleClass('js-selected-graphic');
        
        //check if has any Graphic selected
        if($(this).hasClass('js-selected-graphic') === true){
            createGraphics();
        }
        else{
           turnOffGraphics();
           turnOffAnimation("delete");  
        }
        updateGraphicsCanvas();     
};

var vidClickSetup = function() {
    $('.loader').removeClass('is-hidden');
    $('.js-vid-click').removeClass('js-selected-video');
    $(this).addClass('js-selected-video');
    var thisSrc = $(this).attr('src');
    movie.src = thisSrc;
    removeStopMotionInEditor();
};

var activateEndButtons = function (bType) {
    $('.inactive-js-' + bType + '-m').addClass('js-' + bType + '-m');
    $('.inactive-js-' + bType + '-m').removeClass('inactive-b-a-btn');
    $('.inactive-js-' + bType + '-m').removeClass('inactive-js-' + bType + '-m');
};

var uploadFromComp = function (ev) {
    var files = ev.target.files;
    var maxSize = 10000000;

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var reader = new FileReader();

        reader.onload = (function (theFile) {
            return function (e) {
                if (file.size < maxSize) {
                    updateMediaLibrary(file, e.target.result);
                    $(".popup").addClass("is-hidden");
                    $(".fileError").text("");
                } else {
                    $('.loader').addClass('is-hidden');
                    $(".fileError").text("Videos and images must be smaller than 10MB. Select a different file and try again!");
                }
            };
        })(file);

        reader.readAsDataURL(file);
    }
};

var uploadFromCompToLibrary = function (ev) {
    var files = ev.target.files;
    var maxSize = 10000000;
    //TODO: implement multiple file upload on the server

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var reader = new FileReader();

        reader.onload = (function (theFile) {
            return function (e) {
                if (file.size < maxSize) {
                    var formData = new FormData();
                    formData.append('file', file);
                    $.ajax({
                        url: '/addVideoToLibrary',
                        type: 'POST',
                        data: formData,
                        mimeType: "multipart/form-data",
                        contentType: false,
                        cache: false,
                        processData: false,
                        success: function (data, textStatus, jqXHR) {
                            updateMediaLibrary(file, e.target.result);
                            $(".popup-upload-to-library").addClass("is-hidden");
                        },
                        error: function (file, textStatus, jqXHR) {
                            console.log('file error');
                        }
                    });
                } else {
                    $('.loader').addClass('is-hidden');
                    $(".fileError").text("Videos and images must be smaller than 10MB. Select a different file and try again!");
                }
            };
        })(file);

        reader.readAsDataURL(file);
    }
};

var updateMediaLibrary = function (file, data) {
    //create div and img/video tags

    var type;
    var style;
    var parent;
    var fn;
    var this_still;
    if (file.type.match(/image.*/)) {
        type = 'img';
        style = 'js-img-click';
        parent = 'img-library';
        fn = imgClickSetup;
    }
    else if (file.type.match(/video.*/)) {
        type = 'video';
        style = 'js-vid-click';
        parent = 'vid-library';
        fn = vidClickSetup;
    }

    var div = document.createElement('div');
    div.className += 'i-vid-container';
    var media = document.createElement(type);
    media.className += style;
    media.src = data;
    media.addEventListener('click', fn, false);
    div.appendChild(media);
    document.getElementById(parent).appendChild(div);
};

var labelLines = function () {
    //this function should take an input for the relevant effect, not brute force for all
    for (var e = 0; e < allEffects.length; e++) {
        $("pre:contains('effects." + allEffects[e] + "')").addClass('active-effect');
        $("pre:contains('effects." + allEffects[e] + "')").attr('name', allEffects[e]);
    }
    for (var i in stopMotion.controls) {
        $("pre:contains('stopMotion." + i + "')").addClass('active-' + i);
    }
};


var updateScript = function (code) {
    var scriptOld = document.getElementById('codeScript');
    if (scriptOld) { scriptOld.remove();}
    var scriptNew   = document.createElement('script');
    scriptNew.id = 'codeScript';

    eval(code);
    var adjScript = "";
    var textScript = "\n\ try {\n\ "+code;

    /*TODO: Check to see if the active effects have changed from before to now
    if so, reinit seriously. if not, do nothing
    Also, get rid of that eval
    */

    labelLines();
    var matchEff = document.querySelectorAll(".active-effect");
    var matchNames = [];    

    //turn everything off
    $('.btn-method').removeClass('is-active');          
    

    //turn on back the effects in
    for (var t = 0; t < matchEff.length; t++) {
        var matchE = matchEff[t];
        matchNames.push($(matchE).attr("name"));
        checkBtnStatus(matchE);
    }
    //update effects in editor
    for (var c = 0; c < allEffects.length; c++) {
        var thisEffect = allEffects[c];
        if (matchNames.indexOf(thisEffect) < 0) {
            adjScript += "\n\ effects." + thisEffect + ".amount = 0;";
        } else {
            var adjAmt = effects[thisEffect]['amount'] * mult[thisEffect];
            adjScript += "\n\ effects." + thisEffect + ".amount = " + adjAmt + ";";
        }
    }
    
    //-------------------Stop motion in Script-----------------------//

    if(textScript.indexOf('stopMotion.frames')>=0){           
        var currentStills = document.querySelectorAll('.js-img-click');
        var allFrames = stopMotion.frames.join(",");

        for (var i=0; i<currentStills.length; i++){
           if(allFrames.indexOf(currentStills[i].id)<0){
                 $("#"+currentStills[i].id).removeClass('js-selected-still');
                  $("#"+currentStills[i].id).removeClass('js-selected-video');
          }
          else{
                $("#"+currentStills[i].id).addClass('js-selected-still');
                $("#"+currentStills[i].id).addClass('js-selected-video');
          }
        } 

        stopMotion.addFramesToTimeline();
    }


    if (textScript.indexOf('stopMotion.interval')>=0) {
       $('li[name=interval]').addClass('is-active');
       stopMotion.start();
       //reorganize array here

    } else {
      if (stopMotion.on) {
        stopMotion.stop();
      }
    }


    //-------------------Graphics in Script-----------------------//

    //if there is not position in the editor, turn off graphics
    if(textScript.indexOf('position')<0 && textScript.indexOf('size')<0){
        turnOffGraphics();
    }

    //turn drawing/animation on
    if(textScript.indexOf('drawing')>=0){
       $('li[name=drawing]').addClass('is-active');
    }
    else{
        turnOffDrawing();        
    }

    if(textScript.indexOf('animation')>=0){
        $('li[name=animation]').addClass('is-active');
        //console.log("textScript animation");

        if(textScript.indexOf('animationMode=false')>=0 || textScript.indexOf('animationMode= false')>=0 ||
        textScript.indexOf('animationMode = false')>=0 || textScript.indexOf('animationMode =false')>=0){        
            turnOffAnimation("pause");
        }
        else{
            clearInterval(animationInterval);
            animationInterval = setInterval(animateImage, 60);
        }
    }
    else{
        turnOffAnimation("delete");  
    }   

    updateGraphicsCanvas();

    //-------------------Script-----------------------//

    textScript += adjScript;
    textScript += "\n\ } catch(e){" + adjScript + "\n\ }";
    scriptNew.textContent = textScript;

    document.body.appendChild(scriptNew);
};



var checkBtnStatus = function (effect) {
    //compare the names of effect buttons to the names in activeEffects
    var effectName = $(effect).attr("name");
    $('li[name=' + effectName + ']').addClass("is-active")
};



/*old lessons.js*/
var loadThumbnails = function () {
    var social = $('#social').text();

    if (social == "instagram") {
        $.ajax('/instagramVids', {
            success: function (data, textStatus, jqXHR) {
                var igVids = data;
                if (igVids.length) {
                    for (var i = 0; i < Math.min(igVids.length, 3); i++) {
                        $('#js-fetch-vid' + i).error(function () {
                            $(this).addClass('is-hidden');
                        });
                        $('#js-fetch-vid' + i).removeClass('is-hidden');
                        document.getElementById('js-fetch-vid' + i).src = '/instagram/' + i;
                        document.getElementById('js-fetch-vid' + i).addEventListener("loadeddata", function () {
                        }, false);
                    }
                } else {
                    $('.i-error').text("You don't have any Instagram videos :(");
                }
            },
            error: function (data, textStatus, jqXHR) {
                $('.i-error').text("Uh oh. Your Instagram videos aren't loading. Try refreshing the page to fix it.");
            }
        });
    } else {
        $('.insta-import').removeClass('is-hidden');
    }
};



loadThumbnails();

//account for different browsers with requestAnimationFrame
var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

//begin Whammy video save
var drawVideoFrame = function (time) {
    rafId = requestAnimationFrame(drawVideoFrame);
    capture = frames.length * 60 / 1000;
    captureTxt = Math.floor(100 * capture / vidLen) + '%';
    $('.dl-progress').css('width', captureTxt);
    $('.dl-progress').text('saving...');
    frames.push(canvas.toDataURL('image/webp', 1));
    if (capture >= vidLen) {
        stopDL();
    }
};

var stopDL = function () {
    cancelAnimationFrame(rafId);
    webmBlob = Whammy.fromImageArray(frames, 1000 / 60);
    $('.progressDiv').addClass('is-hidden');
    activateEndButtons('finish');
};
//end Whammy video save

var saveSession = function (blob) {
    var formData = new FormData();

    formData.append('title', $('.js-video-title').val());
    formData.append('descr', $('.js-video-descr').val());
    formData.append('token', $('.js-video-token').val());
    formData.append('code', myCodeMirror.getValue());
    formData.append('video', blob);

    $.ajax({
        url: '/uploadFinished',
        type: 'POST',
        data: formData,
        mimeType: "multipart/form-data",
        contentType: false,
        cache: false,
        processData: false,
        success: function (token, textStatus, jqXHR) {
            $('.share-p-text-container').removeClass('is-hidden');
            $('.js-h-onload').addClass('is-hidden');
            $('.js-s-onload').removeClass('is-hidden');
            $('.js-share').removeClass('is-inactive-btn');
            $('.js-share').attr('href', '/share/' + token);
            $('.js-share-link-to-copy').val(window.location.host + '/share/' + token);

            window.history.pushState("Share", "Share Your Video", '/share/' + token);
            addthis.layers.refresh();
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
};

var modalVideoLoad = function (mname) {
    addThisStyles();
    $('.ss-modal').removeClass('is-hidden');
    $('.js-' + mname + '-content').removeClass('is-hidden');
    $('.js-ss-title').text(mname);
    $('.cover50').removeClass('is-hidden');
    $('.progressDiv').removeClass('is-hidden');
    frames = [];
    rafId = requestAnimationFrame(drawVideoFrame);
};

//addthis functionality and appearance
var addThisStyles = function () {
    $('.at15t_facebook').attr('id', 'fb-btn-styling');
    $('.at15t_facebook').html('<img src="/img/icons/fb-icon.png"> share with facebook');
    $('.at15t_twitter').attr('id', 'tw-btn-styling');
    $('.at15t_twitter').html('<img src="/img/icons/tw-icon.png"> share with twitter');
};

var lessonIsActive = function (newLesson) {
    $(newLesson).show();
    $(newLesson).animate({
        margin: "0px"
    }, 350);
};

var showInfo = function (term, color) {
    $('pre:contains(' + term + ')').css("background-color", color);
};

var removeInfo = function (term) {
    $('pre:contains(' + term + ')').css("background", "none");
};

var updateLearnMore = function (stepNum, lessonText, lessonTitle, lessonImg) {
    $('.js-lesson-p-update').text(stepNum);
    $('.js-lesson-text-update').html(lessonText);
    $('.lm-title').text(lessonTitle);
    $('.js-lesson-img').html(lessonImg);
};

var trackLesson = function (lessonName) {
    last_lessonId = lessonName;
    $.post('/lesson/' + lessonName);
};

var getDateMMDDYYYY = function () {
    var date = new Date();

    var m = (date.getMonth() + 1).toString();
    var d = date.getDate().toString();
    var y = date.getFullYear().toString();

    return m + "-" + d + "-" + y;
};

var createCodeInEditor = function(text, cmclass){ 
    myCodeMirror.replaceRange(text, CodeMirror.Pos( myCodeMirror.lastLine()));
    myCodeMirror.markText({
                    line:  myCodeMirror.lastLine(),
                    ch: 0
                }, CodeMirror.Pos(myCodeMirror.lastLine()), { className: cmclass });
};

var updateCodeInEditor = function(text, cmline, cmclass){
    myCodeMirror.replaceRange(text, { line: cmline, ch: 0 }, CodeMirror.Pos( cmline ) );
    myCodeMirror.markText({
                    line: cmline,
                    ch: 0
                }, CodeMirror.Pos(cmline), {className: cmclass});                   
};



