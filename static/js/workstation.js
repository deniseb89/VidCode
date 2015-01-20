var movie,
    canvas,
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
lastLessonId = null;
newSession = true;

var setup = function() {
    newSession = true;

    if(newSession){
        // $('.CodeMirror-code').addClass('is-hidden');
    } else {
    // saved session
        activateSession();
        updateScript($('#codemirror').val());
    }
    $('.basic-filter-method').removeClass('is-hidden');
    movie.addEventListener("loadeddata", changeSrc, false);
};

var checkWebGL = function () {
    //check Seriously compatibility
    if (Seriously.incompatible() || !Modernizr.webaudio || !Modernizr.csstransforms) {
        $('.compatibility-error').removeClass('is-hidden');
    } else {
        InitSeriously();
        setup();
    }
    movie.removeEventListener('canplay', checkWebGL, false);
};

var InitSeriously = function () {
    seriously = new Seriously();

    //TODO: generalize to my media
    video = seriously.transform('reformat');
    video.width = 420;
    video.height = 250;
    video.mode = 'distort';   
    video.source = ('#myvideo');

    target = seriously.target('#canvas'); 
    graphic = seriously.source(graphicsCanvas);   

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

var imgClickSetup = function () {
    changeSrc();
    updateLearnMore(2, '<p>Drag in the <strong>"frames"</strong> button. Select your favorite stills. Now, drag over the <strong>"Interval" button</strong> into the code editor.</p>', 'Upload Stills', '<img class="lessonImg" src="/img/lessons/lesson-stop-motion.png">');

    $(this).toggleClass('js-selected-video');
    $(this).toggleClass('js-selected-still');

    var this_still;
    //generalize this somewhere else so when source changes, target changes
    if (!stopMotion.on){
      this_still = seriously.transform('reformat');
      this_still.width = 420;
      this_still.height = 250;
      this_still.mode = 'contain';
      this_still.source = this;           
      effects[allEffects[0]]["bottom"] = seriously.source(this_still);
    }

    var stills = document.querySelectorAll('.js-selected-still');
    var frameArr = new Array(stills.length);
    for (var i=1; i<=frameArr.length; i++){
      frameArr[i-1]=i;
    }
    frameArr.join(",");
    var allTM = myCodeMirror.getAllMarks();
    for (var m=0; m<allTM.length; m++){
      var tm = allTM[m];
      if (tm.className=="cm-frames"){
        var cmLine = tm.find();
        myCodeMirror.replaceRange(' stopMotion.frames = ['+frameArr+'];',{ line: cmLine.to.line, ch: 0 }, CodeMirror.Pos( cmLine.to.line ) );
        myCodeMirror.markText({ line: cmLine.to.line, ch: 0 }, CodeMirror.Pos( cmLine.to.line ),{ className: "cm-frames" });
        $(".cm-frames").effect("highlight",2000);
      }
    }
};

var vidClickSetup = function() {
    $('.loader').removeClass('is-hidden');
    $('.js-vid-click').removeClass('js-selected-video');
    $(this).addClass('js-selected-video');
    var thisSrc = $(this).attr('src');
    movie.src = thisSrc;
};

var activateSession = function () {
    $('.vid-placeholder').addClass('is-hidden');
    $(".clearHover").addClass("is-hidden");
    $(".buttons").addClass("is-aware");
    $(".runbtn").removeClass("is-hidden");
    $(".video2").removeClass("is-hidden");
    $('.CodeMirror-code').removeClass('is-hidden');
    activateEndButtons('save');
    activateEndButtons('save-code');
    activateEndButtons('share');
};

var changeSrc = function () {
    updateLearnMore(2, "<p>You just made a video play with CODE! Your code is now populating the <strong>'text editor'</strong> which speaks to the rest of the computer program and tells it what to do!</p><p>Go ahead and <strong>drag over a filter button on the bottom left.</strong> Tell that computer who's boss!</p>", 'Awesome!', '');
    numVidSelect++;
    $('.loader').addClass('is-hidden');
    $(".popup").addClass("is-hidden");

    //this should only happen if it's a new session
    if (newSession) { activateSession(); }

    labelLines();
    if (this.tagName=='VIDEO') {
        effects[allEffects[0]]["bottom"] = seriously.source(video);
        vidLen = Math.round(this.duration);
      } else {
        vidLen = 10; //arbitrarily make the stop-motion video length 10 seconds
        movie.src = "";
    }
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
    var cmScript = myCodeMirror.getValue();

    eval(cmScript);
    var adjScript = "";
    var textScript = "\n\ try {\n\ "+cmScript;

    /*TODO: Check to see if the active effects have changed from before to now
    if so, reinit seriously. if not, do nothing
    Also, don't add and remove the script each time. Just update the script string via innerhtml
    */

    if (textScript.indexOf('stopMotion.interval')>=0) {     
        stopMotion.start();
    } else {
      if (stopMotion.on) {
        stopMotion.stop();
      }
    }

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
        console.log("textScript animation");

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


    textScript += adjScript;
    textScript += "\n\ } catch(e){" + adjScript + "\n\ }";
	scriptNew.text = textScript;

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
    $('.' + mname + '-modal').removeClass('is-hidden');
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

trackLesson = function (lessonName) {
    lastLessonId = lessonName;
    $.post('/lesson/' + lessonName);
};

getDateMMDDYYYY = function () {
    var date = new Date();

    var m = (date.getMonth() + 1).toString();
    var d = date.getDate().toString();
    var y = date.getFullYear().toString();

    return m + "-" + d + "-" + y;
};