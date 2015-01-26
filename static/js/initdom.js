/* set all event listeners */
$(document).ready(function () {
    movie = document.getElementById('myvideo');
    canvas = document.getElementById('canvas');
    checkWebGL();
    movie.addEventListener("canplay", activateSession, false);

    supportCanvas = document.getElementById('supportCanvas');
    graphicsCanvas = document.getElementById('graphicsCanvas');
    graphicsContext = graphicsCanvas.getContext("2d");
    //graphics
    supportCanvas.addEventListener('mousemove', drawGraphics, false);
    supportCanvas.addEventListener('mouseup', updateGraphicsCanvas, false);

    var inputFile = document.getElementById('inputFile');
    var inputFileToLibrary = document.getElementById('inputFileToLibrary');
    inputFile.addEventListener('change', uploadFromComp, false);
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
    $('#basic-filter-method').click(function () {
        updateLearnMore(1, "<p>JavaScript?</p><p>Javascript is a programming language. Since computers don't speak human languages like English or Spanish, we use programming languages to talk to them.</p><p>All your favorite apps are made by talking to computers with programming languages.</p>", 'What are we writing? Javascript!', '<img class="lessonImg" src="img/lessons/lesson-1-right.png">');
    });

    $('#graphic-method').click(function () {
        updateLearnMore(1, "<p>That's where things are placed on your video!</p><p>Computer programs learn where things are in space by a system of (x,y) coordinates.  Remember that from geometry?! ;)</p><p>But,a video is just one grid, with x as horizontal and y as vertical. Lke the one below!</p><p>If you wanted to put your graphic on the top right corner of your video player, would x or y be zero?</p>", 'What is an x y coordinate?', '<img class="lessonImg" src="/img/lessons/pixel.jpg">');
    });

    $('.learnMore').on('click', '.js-lesson-4-sm', function () {
        updateLearnMore(4, "<p>The <strong>interval property</strong> controls the <strong>speed</strong> that your stop motion moves!</p><p>If only there had been CODE like this back in the day, think what Charlie Chaplin would have created!</p><p>Your code uses milliseconds so <strong>1000 is the same as one second!</strong></p><div class='btn btn-primary js-lesson-5-sm right'>What's Next?</div>", "More about Interval", '');
        trackLesson('2-4');
    });
    $('.learnMore').on('click', '.js-lesson-5-sm', function () {
        updateLearnMore(5, "<p><strong>Drag over the 'Reverse' button.</strong></p><p>Reverse is a property that takes values that are either true or false (it's called a boolean, we'll go over more on that weird word later)</p><p>How can you make the video reverse? Give it a go! There are no wrong answers! Just discoveries on the way to the right answer! Coding is ALL about trying and failing then eventually… finding the answer! (cue triumphant music!)</p>", "Reverse it up!", '');
        trackLesson('2-5');
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

    $('.save-btns-container').on('click', ".js-save-m", function () {
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

            lessonIsActive(".js-effects");

            var eff = ui.draggable.attr("name");
            $('[name=' + eff + ']').addClass("is-active");

            var filter = seriouslyEffects[eff];
            if (filter) {
                numFilterSelect++;
                if (numFilterSelect == 1) {
                    updateLearnMore(3, '<p>The red number you see is the <strong>"value"</strong> of this line of code.</p><p>Go ahead and change that value to customize your effect.</p><p>Then <strong>bring in another filter!</strong></p>', 'You have a filter!', '');
                } else if (numFilterSelect == 2) {
                    updateLearnMore(4, '<p>Now that you have 2 filters do you see something in common? "Effects"</p><p><strong>Effects is an Object</strong>. This is a word you will be hearing a lot. Objects hold data. In this case the effects Object holds ALL the effects inside of itself. When we write the word "effects" the program knows we are asking to retrieve a piece of data from the effects object.</p>', 'Notice anything about your code?', '');
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

            myCodeMirror.save();

            $(".cm-" + eff).effect("highlight", 2000);
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
        myCodeMirror.save();
    });

    $('.methodList li').each(function () {
        $(this).draggable({
            helper: "clone",
            revert: "invalid"
        });
    });

    $('.js-img-click').click(imgClickSetup);

    $('.js-vid-click').click(vidClickSetup);

    $('.js-graph-click').click(graphClickSetup);

    $( "#timeline-sortable" ).sortable({
        distance:30,
        placeholder: "placeholder-highlight",
        stop: function( event, ui ) {
            reorderFrames();
        }
    });

    //Switch between content
    $('.js-switch-view').click(function () {
        //Todo: Template these
        var view = ($(this).attr('id'));
        var lName = ($(this).attr('name'));
        var lessonNum = ($(this).attr('lessnum'));
        $('.basic-filter-method').addClass('is-hidden');
        $('.graphic-method').addClass('is-hidden');
        $('.stop-motion-method').addClass('is-hidden');
        $('.' + view).removeClass('is-hidden');
        $('.js-lesson-name').text(lName);
        $('.js-lesson-page-num-total').text(lessonNum);
    })

    $("html").on("click", ".js-switch-menu-appear", function () {
        $('.js-switch-view-container').toggleClass('is-hidden');
        $('body').toggleClass('js-switch-menu-appear');
    });
});
