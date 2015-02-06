/* set all event listeners */
$(document).ready(function () {
    movie = document.getElementById('myvideo');
    canvas = document.getElementById('canvas');
    checkWebGL();
    movie.addEventListener("canplay", activateSession, false);

    //graphics
    supportCanvas = document.getElementById('supportCanvas');
    graphicsCanvas = document.getElementById('graphicsCanvas');
    graphicsContext = graphicsCanvas.getContext("2d");
    supportCanvas.addEventListener('mousemove', drawGraphics, false);
    supportCanvas.addEventListener('mouseup', updateGraphicsCanvas, false);

    //camera
    cameraCanvas = document.getElementById('cameraCanvas');
    cameraContext = cameraCanvas.getContext('2d');
    bufferCanvas = document.getElementById('bufferCanvas');
    bufferContext = bufferCanvas.getContext('2d');

    var inputFile = document.getElementById('inputFile');
    var inputFileToLibrary = document.getElementById('inputFileToLibrary');
    inputFile.addEventListener('change', uploadToAstra, false);
    inputFileToLibrary.addEventListener('change', uploadFromCompToLibrary, false);

    //initialize codeMirror
    myCodeMirror = CodeMirror.fromTextArea(document.getElementById('codemirror'), {
        mode: "javascript",
        theme: "solarized light",
        lineWrapping: true,
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true
    });

    var codeDelay;
    myCodeMirror.on("change", function () {
        clearTimeout(codeDelay);
        codeDelay = setTimeout(function(){
            updateScript(myCodeMirror.getValue());
        }, 300);
    });

    //lesson updates for NYTM
    $('#stop-motion-method').click(function () {
        stillsSelectedLesson = false;
        updateLearnMore(1, "<p>Now let's get creative!</p><p>We can make our own stop motion masterpiece with CODE! And you know what's even more amazing then that?!</p><p>Because we are using CODE to create our stop motion we have more control to make it our own that we ever could by a program that someone else wrote. This is yours!</p><p>Let's go!</p>", 'The Power of Code', '');
    });
    $('#filter-method').click(function () {
        updateLearnMore(1, "<p>JavaScript?</p><p>Javascript is a programming language. Since computers don't speak human languages like English or Spanish, we use programming languages to talk to them.</p><p>All your favorite apps are made by talking to computers with programming languages.</p>", 'What are we writing? Javascript!', '<img class="lessonImg" src="img/lessons/lesson-1-right.png">');
    });

    $('#graphic-method').click(function () {
        updateLearnMore(1, "<p>Ooooo, that's a fun word.</p><p>You can now make a graphic animate on top of your video!</p><p>Your stop motion projects were <strong>frame based animations</strong> - meaning within each frame there was something that moved. Your graphic animation will be <strong>generative</strong> - meaning it changes with time and based off everlasting calculations!</p><p><a target='_blank' href='https://processing.org/exhibition/'>check out generative animation artwork here</a></p><div class='btn btn-primary js-lesson-2-g right'>Next →</div>", 'Generative', '');
    });

    $('.learnMore').on('click', '.js-lesson-2-g', function () {
        updateLearnMore(2, "Now let's get a crazy cool graphic on top of your video!</p><p><strong>Go ahead and drag in a graphic from your library.</strong></p>", "Adding Graphics", '');
        trackLesson('3-2');
    });


    $('#pixelate-method').click(function () {
    });

    $('.learnMore').on('click', '.js-lesson-5-f', function () {
        updateLearnMore(5, "<p>List the names of the effects that are stored in the 'effects' object?</p><textarea class='full-width'></textarea><div class='btn btn-primary js-lesson-6-f right'>Submit</div>", "Quiz", '');
        trackLesson('1-5');
    });

    $('.learnMore').on('click', '.js-lesson-6-f', function () {
        updateLearnMore(6, "<p><strong>Great job!</strong></p><p>Now, try typing in a filter that you havent used yet into the text editor. Don't drag and drop this time, just type :)</p><p class='js-hint-1-6 purpleText'>Get a hint</p><div class='btn btn-primary js-lesson-7-f right'>Next →</div>", "Quiz", '');
        trackLesson('1-6');
    });

    $('.learnMore').on('click', '.js-lesson-7-f', function () {
        updateLearnMore(7, "<p>Whoa! You did it! Let's move on coding PRO! Time to create a stop motion! Go ahead and <a class='purpleText' target='_blank' href='/doc/vocab-sheet-1.pdf'>download the vocab cheat sheet</a> from Filters to build on as you go!</p><div class='btn btn-primary js-lesson-7-f right'>Next Lesson: Stop Motion</div>", "Next Steps", '');
        trackLesson('1-7');
    });

    $('.learnMore').on('click', '.js-lesson-4-sm', function () {
        updateLearnMore(4, "<p>The <strong>interval property</strong> controls the <strong>speed</strong> that your stop motion moves!</p><p>If only there had been CODE like this back in the day, think what Charlie Chaplin would have created!</p><p>Your code uses milliseconds so <strong>1000 is the same as one second!</strong></p><div class='btn btn-primary js-lesson-5-sm right'>What's Next?</div>", "More about Interval", '');
        trackLesson('2-4');
    });
    $('.learnMore').on('click', '.js-lesson-5-sm', function () {
        updateLearnMore(5, "<p><strong>Drag over the 'Reverse' button.</strong></p><p>Reverse is a property that takes values that are either true or false (it's called a boolean, we'll go over more on that weird word later)</p><p>How can you make the video reverse? Give it a go! There are no wrong answers! Just discoveries on the way to the right answer! Coding is ALL about trying and failing then eventually… finding the answer! (cue triumphant music!)</p>", "Reverse it up!", '');
        trackLesson('2-5');
    });



    $('.learnMore').on('click', '.js-hint-1-6', function () {
        $(this).removeClass('purpleText');
        $(this).html('Make sure that your text matches the other filters. For example, you could type <strong>effects.blur.amount = 12</strong>');
    });


    //turn tooltips on
    $(".save-modal").tooltip({selector: '[data-toggle=tooltip]'});

    //share success on copy click
    $('.js-copy-sucess').click(function () {
        $(this).text('✓');
    });

    // video events section

    movie.addEventListener('playing', function () {
        //also update movie.___() line in code editor
        $("pre:contains('movie.pause()')").html('<span class="cm-variable">movie</span>.<span class="cm-property">play</span>();');
        $(".runbtn").text('Pause');
    });

    movie.addEventListener('pause', function () {
        //also update movie.___() line in code editor
        $("pre:contains('movie.play()')").html('<span class="cm-variable">movie</span>.<span class="cm-property">pause</span>();');
        $(".runbtn").text('Play');
    });

    // End video events section

    $(".js-upload-video").click(function () {
        $(".popup").removeClass("is-hidden");
    });

    $(".js-hide-upload").click(function () {
        $('.loader').addClass('is-hidden');
        $(".popup").addClass("is-hidden");
    });

    // Add video to library start

    $(".js-upload-to-library").click(function () {
        $(".popup-upload-to-library").removeClass("is-hidden");
    });

    $(".js-hide-upload-to-library").click(function () {
        $('.loader-upload-to-library').addClass('is-hidden');
        $(".popup-upload-to-library").addClass("is-hidden");
    });

    // Add video to library end

    $(".runbtn").click(function () {
        $(".video2").removeClass("is-hidden");
        movie.paused ? movie.play() : movie.pause();
    });

    $('.js-reset-code').click(function () {
        var editor_text = $('textarea').text();
        myCodeMirror.setValue(editor_text);
        for (var i = 0; i < allEffects.length; i++) {
            var eff = allEffects[i];
            $('[name=' + eff + ']').removeClass("is-active");
        }
        $('.methodList').removeClass('is-hidden');
        movie.playbackRate = 1;
    });

    $('.save-btns-container').on('click', ".js-share-m", function () {
        modalVideoLoad('share');
    });

    $('.save-btns-container').on('click', ".js-save-code-m", function () {
        modalVideoLoad('save');
    });

    $('.save-btns-container').on('click', ".js-save-code-m", function () {

        var _cmScript = myCodeMirror.getValue();

        var _videoSrc = (document.getElementById('myvideo').src)

        //may need to add a global variable to store the current video token in session.
        //TODO: handle uploaded videos that are not in the library (don't have a file ID and sends the entire binary data.)
        /*
        http://localhost:5000/workstation-update-session Failed to load resource: the server responded with a status of 413 (Request Entity Too Large)
        */
        $.post("/workstation-update-session", {'lessonId': last_lessonId, 'token': 'dummy-token', 'videoSrc': _videoSrc ,'code': _cmScript});
    });

    $('.finish-btn-container').on('click', ".js-finish-m", function () {
        $('.js-finish-m').addClass('inactive-b-a-btn');
        $('.js-finish-m').addClass('inactive-js-finish-m');
        $('.js-finish-m').removeClass('js-finish-m');
        saveSession(webmBlob);
    });

    $('.js-hide-a-m').click(function () {
        $('.ss-modal').addClass('is-hidden');
        $(this).addClass('is-hidden');
        $('.js-s-onload').addClass('is-hidden');
        $('.js-h-onload').removeClass('is-hidden');
        $('.dl-progress').css('width', '1px');
        $('.js-finish-m').addClass('inactive-b-a-btn');
        $('.js-finish-m').addClass('inactive-js-finish-m');
        $('.js-finish-m').removeClass('js-finish-m');
        $('.js-ss-both-content').addClass('is-hidden');
    });


    $(".tabs-2").droppable({
        drop: function (event, ui) {
            dropEffects(ui);
        }
    });

    $(".draggable").click(function () {
        var eff = ($(this).attr('name'));
        $(this).removeClass("is-active");

        var allTM = myCodeMirror.getAllMarks();
        for (var m = 0; m < allTM.length; m++) {
            var tm = allTM[m];
            if (tm.className == "cm-" + eff) {
                myCodeMirror.removeLine(tm.find().to.line);
            }
        }

        if (eff == "drawing" ){
            turnOffDrawing();
            updateGraphicsCanvas();
        }
        if(eff == "animation"){
            turnOffAnimation("delete");
        }
        if(eff == "pixel" || eff == "shape" || eff == "pixels" || eff == "background" || eff == "audio"){
            turnOffPixelate(eff);
        }

        myCodeMirror.save();
    });

    $('.methodList li').each(function () {
        $(this).draggable({
            helper: "clone",
            revert: "invalid"
        });
    });

     $('.js-vid-click').each(function () {

        $(this).draggable({
            helper: "clone",
            revert: "invalid",
            start: function (e, ui) {
                $('.js-vid-click').removeClass('js-selected-video');
                ui.helper.width(ui.helper.prevObject[0].clientWidth);
                ui.helper.height(ui.helper.prevObject[0].clientHeight);
            },
            cursorAt: {left:45, top:30},
            stop: function(event, ui){
                $(this).addClass('js-selected-video');
            }
        });
    });

     $('.js-graph-click').each(function () {
        $(this).draggable({
            helper: "clone",
            revert: "invalid",
            start: function (e, ui) {
                ui.helper.width(ui.helper.prevObject[0].clientWidth);
                ui.helper.height(ui.helper.prevObject[0].clientHeight);
            },
            cursorAt: {left:45, top:30}
        });
    });


    $('#canvas').droppable({
        drop: function (event, ui) {
            if(ui.draggable[0].tagName == "VIDEO"){
                $('.loader').removeClass('is-hidden');
                $('.js-vid-click').removeClass('js-selected-video');
                ui.draggable.addClass('js-selected-video');
                var thisSrc = ui.draggable.attr("src");
                movie.src = thisSrc;
            }
            else if(ui.draggable[0].tagName == "IMG"){
                if(ui.draggable[0].className.indexOf("js-graph") >= 0){
                  $('.js-graph-click').removeClass('js-selected-graphic');
                  var thisSrc = ui.draggable.attr("src");
                    var allGraphs = document.querySelectorAll('.js-graph-click');
                    $('#mygraphic').attr("id", "");

                    for(var i = 0; i < allGraphs.length; i++){
                        if(allGraphs[i].src.indexOf(thisSrc) >= 0 ){
                            if(allGraphs[i].style.position != "absolute"){
                               allGraphs[i].setAttribute('class', 'js-graph-click ui-draggable js-selected-graphic');
                               createGraphics();
                               updateGraphicsCanvas();
                               updateLearnMore(3, "<p>That looks great!</p><p><strong>Now, try changing the value of the 'size'!</strong><p class='js-l-4-g-error'></p><div class='btn btn-primary js-lesson-4-g right'>Changed the size! →</div>", 'Video magic!', '');
                           }
                        }
                    }
                }
            }
            else{
                dropEffects(ui);
            }
        }
    });

     $('.js-img-click').each(function () {
        $(this).draggable({
            helper: "clone",
            revert: "invalid",
            connectToSortable: "#timeline-sortable",
            start: function(event, ui) {
               ui.helper.width(ui.helper.prevObject[0].clientWidth);
               ui.helper.height(ui.helper.prevObject[0].clientHeight);

               stopMotion.dragID = ui.helper.prevObject[0].id;
               //console.log(ui.helper.prevObject[0].id);
          },
          cursorAt: {left:45, top:30}

        });
    });

     $('#timeline-sortable').sortable({
        distance:30,
        placeholder: "placeholder-highlight",

        stop: function( event, ui ) {
           $('.ui-draggable').off('mouseup');
           if(ui.item[0].tagName == "IMG"){
                dropFrames(ui.item);
            }
           stopMotion.reorderFrames();
       },
       out: function(event, ui){
            $('.ui-draggable').on('mouseup', function() {
                ui.item[0].children[0].setAttribute('class','');
                console.log(ui.item[0].children[0].className);
                stopMotion.reorderFrames();
            });
       }

      });


   var dropEffects = function(ui){
            lessonIsActive(".js-effects");

            var eff = ui.draggable.attr("name");
            $('[name=' + eff + ']').addClass("is-active");

            var filter = seriouslyEffects[eff];
            if (filter) {
                numFilterSelect++;
                if (numFilterSelect == 1) {
                    updateLearnMore(3, '<p>The red number you see is the <strong>"value"</strong> of this line of code.</p><p>Go ahead and change that value to customize your effect.</p><p>Then <strong>bring in another filter!</strong></p>', 'You have a filter!', '');
                } else if (numFilterSelect == 2) {
                    updateLearnMore(4, '<p>Now that you have 2 filters do you see something in common? "Effects."</p><p><strong>Effects is an Object.</strong> This is a word you will be hearing a lot. Objects hold data. When we write the word "effects" in the editor we are asking to retrieve data from the "effects" object.  Computer programs LOVE passing information around.</p><div class="btn btn-primary js-lesson-5-f right">Take a Quiz! →</div>', '');
                }
                var input;
                for (var i in filter.inputs) {
                    input = filter.inputs[i];
                    if ((i != 'source') && (i != 'timer') && (i != 'overlay')) {
                        lineText = '\n\ effects.' + eff + '.' + i + ' = ' + defaultValue[input.type] + ';';
                        createCodeInEditor(lineText, "cm-" + eff);
                    }
                }
            }
            else if (stopMotion.controls.hasOwnProperty(eff)) {
                createStopMotionInEditor(eff);
            }
            else if (eff == "drawing" ){
                createDrawing();
            }
            else if (eff == "animation"){
                if(hasGraphic) createAnimation();
                else  $('[name=' + eff + ']').removeClass("is-active");
            }
            else if (eff == "pixel" || eff == "shape" || eff == "pixels" || eff == "background" || eff == "audio" || eff == "motion"){
                createPixelate(eff);
            }


            myCodeMirror.save();
            $(".cm-" + eff).effect("highlight", 2000);
    };

   var dropFrames = function(item){
            updateLearnMore(2, '<p>Drag in the <strong>"frames"</strong> button. Select your favorite stills. Now, drag over the <strong>"Interval" button</strong> into the code editor.</p>', 'Upload Stills', '<img class="lessonImg" src="/img/lessons/lesson-stop-motion.png">');
            if (!stopMotion.on) changeUniqueSrc(item[0]);
            item.addClass('js-selected-still');
            item.addClass('js-selected-video');


            //recalculate and keep only frames which are still selected
            var selectedStills = document.querySelectorAll('.js-selected-still');
            var newFrames = [];
            for (var i=0; i<stopMotion.frames.length; i++){
              var frameIsSelected = false;
              for(var j = 0; j < selectedStills.length; j++){
                if(selectedStills[j].id == stopMotion.frames[i]) frameIsSelected = true;
              }
              if (frameIsSelected) newFrames.push(stopMotion.frames[i]);
            }


            //add new item to the new frames
            newFrames.splice(item.index(), 0, stopMotion.dragID);
            stopMotion.frames = newFrames;
            createStopMotionInEditor("frames");
            stopMotion.addFramesToTimeline();
   };


    $('.js-img-click').click(imgClickSetup);

    $('.js-vid-click').click(vidClickSetup);

    $('.js-graph-click').click(graphClickSetup);

    //Switch between content
    $('.js-switch-view').click(function () {
        //Todo: Template these
        if (newSession){
            activateSession();
        }
        var view = ($(this).attr('id'));
        var lName = ($(this).attr('name'));
        var lessonNum = ($(this).attr('lessnum'));
        $('.filter-method').addClass('is-hidden');
        $('.stop-motion-method').addClass('is-hidden');
        $('.graphic-method').addClass('is-hidden');
        $('.pixelate-method').addClass('is-hidden');
        $('.' + view).removeClass('is-hidden');
        $('.js-lesson-name').text(lName);
        $('.js-lesson-page-num-total').text(lessonNum);
    })

    $("html").on("click", ".js-switch-menu-appear", function () {
        $('.js-switch-view-container').toggleClass('is-hidden');
        $('body').toggleClass('js-switch-menu-appear');
    });


    $('#access-camera').click(function(){

       $('#recordBtn').toggleClass('is-hidden');

		if(pixelate.cameraStatus){

			this.innerHTML = "Access Camera";
            pixelate.cameraStatus = false;
			pixelate.turnOff();
            $('#playBtn').addClass('is-hidden');
		}else{
			this.innerHTML = "Turn Off Camera";
			pixelate.capture();
		}
	});
    $('#recordBtn').click(function(){
        if(pixelate.playing){
              pixelate.stopVideo();
        }

        if(pixelate.recording){
            pixelate.stopRecording();

        }else{
            pixelate.startRecording();
        }
    });
    $('#playBtn').click(function(){
        if(!pixelate.playing){
            pixelate.playVideo();

        }else{
            pixelate.stopVideo();
        }
    });

    $( window ).resize(function() {
        if(!$('.video2').hasClass('is-hidden')){
            adjustCanvasHeight();
        }
        // var timelineWidth = $('#stop-motion-timeline').width();
        // document.getElementById('stop-motion-timeline').style.height = timelineWidth/8+"px";
    });


});
