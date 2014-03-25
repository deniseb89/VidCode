
$( document ).ready(function() {

    var delay=1000//1 seconds
    setTimeout(function(){
var media = document.getElementById('myvideo');
    seriously = new Seriously(),
    video = seriously.source('#myvideo'), // get video element by CSS selector
    target = seriously.target('#canvas'), // output canvas
    effects = {
    vignette: seriously.effect('vignette'),
    blur: seriously.effect('blur'),
    filmgrain: seriously.effect('filmgrain')
    };

effects.vignette.source = video;
effects.vignette.amount = '#vignette_amount';
effects.blur.source = effects.vignette;
effects.blur.amount = '#blur_amount';
effects.filmgrain.source = effects.blur;
effects.filmgrain.amount = '#grain_amount';
target.source = effects.filmgrain;

seriously.go();

   $(".runbtn").text(media.paused ? "Play" : "Pause");

    // Using CodeMirror
        var editor_text = "Testing";

            var glossary = {
                'function':
'In vidcode, a function is a block of code which executes a certain behavior.\
 * You can \"call\" on a function to complete its behavior in other parts of your code (and as many times as you want).\
 * Our vidcode has 3 functions: pixelate(), blackandWhiteProcessing(), and scrubProcessing().',
                'play' :
' * \"Play\" is a function which can be applied to an object.  In our code the object is \"movie\".\
 * To apply a function to an object you place it directly after the object with a period in between.',
                'foreach' :
' * foreach allows you to cycle through all the pixels in your video.  The computer reads each of your pixels in list form (a really loooong list), then paints them on the screen.  This is the secret to video processing!',
                'effects' :
' * effects is an object that contains information about each filter you add to your video.'
            };

            var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('codemirror'),  {
                  value: "function myScript(){return 100;}\n",
                  mode:  "javascript",
                  theme: "solarized light",
                  lineWrapping: true,
                  lineNumbers: true
                });

            $(".cm-keyword:contains('function')")
                .addClass('vc-glossary')
                .attr('title', glossary.function)
                .data('toggle', 'tooltip')
                .data('placement', 'bottom')
                .tooltip();

            $(".cm-variable:contains('foreach')")
                .addClass('vc-glossary')
                .attr('title', glossary.foreach)
                .data('toggle', 'tooltip')
                .data('placement', 'bottom')
                .tooltip();

            $(".cm-variable:contains('pixelate()')")
                .addClass('vc-glossary')
                .attr('title', 'This is a method or function, same thing.')
                .data('toggle', 'tooltip')
                .data('placement', 'right')
                .tooltip();

            $(".cm-variable:contains('effects')")
                .addClass('vc-glossary')
                .attr('title', glossary.effects)
                .data('toggle', 'tooltip')
                .data('placement', 'right')
                .tooltip();

              function GetScrubVals(){
              var matches = document.querySelectorAll(".cm-number");
                            console.log(matches.length);
                effects.filmgrain.amount = parseInt($(matches[0]).text())/10;
                effects.blur.amount = parseInt($(matches[1]).text())/100;
                effects.vignette.amount = Math.round(parseInt($(matches[2]).text()));
              }

var VigArr = {
  
    init : function ( element ) {
      element.node.dataset.value =  4;
    },
  
    start : function ( element ){  
      return parseInt ( element.node.dataset.value, 10 );
    }, 
    
    change : function ( element, valin ) { 
      valout = valin > 0 ? valin : 0;
      valout = Math.floor(valout/20);
      element.node.dataset.value = valout;
      element.node.textContent = valout;
      if (valin>0&&(valin%20)==0) {GetScrubVals()};
    },
    
    end : function () {}
};
            function FindCMnums(){
              var matches = document.querySelectorAll(".cm-number");
              for (var i = 0; i < matches.length; i++)
              {
                var match = matches[i];
                new Scrubbing ( 
                  match, {adapter: VigArr, driver : [ Scrubbing.driver.Mouse,
                   Scrubbing.driver.MouseWheel,
                   Scrubbing.driver.Touch
                   ]});
                  //add IDs to each effect handler
                match.addEventListener("mouseover",function(){this.style.cursor="pointer";},false);
                match.addEventListener("mousewheel", function(){this.style.cursor="pointer";},false);                                 
                } 
                }  

    $("#grain_amount").change(function(){
      myCodeMirror.setSelection(CodeMirror.Pos(11,0),CodeMirror.Pos(12,0))
      // myCodeMirror.setValue( editor_text + '\n\    effects.filmgrain.amount = ' + effects.filmgrain.amount + ';\n\    effects.blur.amount = ' + effects.blur.amount + ';'); 
    });

    $("#blur_amount").change(function(){
      myCodeMirror.setSelection(CodeMirror.Pos(12,0),CodeMirror.Pos(13,0))
    });

    $("#vignette_amount").change(function(){
      myCodeMirror.setSelection(CodeMirror.Pos(13,0),CodeMirror.Pos(14,0))
      // myCodeMirror.setValue( editor_text + '\n\    effects.filmgrain.amount = ' + effects.filmgrain.amount + ';\n\    effects.blur.amount = ' + effects.blur.amount + ';\n\    effects.vignette.amount = ' + effects.vignette.amount + ';');
    });

    $(".tabs-2").droppable({
        drop: function( event, ui ) {
          $( ".CodeMirror" ).effect("highlight",2000);

          if(ui.draggable.attr("id") =="filmdrag"){
                myCodeMirror.setSelection(CodeMirror.Pos(11,0),CodeMirror.Pos(12,0))
          } else if (ui.draggable.attr("id") =="blurdrag"){
                myCodeMirror.setSelection(CodeMirror.Pos(12,0),CodeMirror.Pos(13,0))
          } else if(ui.draggable.attr("id") =="vigdrag"){
                myCodeMirror.setSelection(CodeMirror.Pos(13,0),CodeMirror.Pos(14,0))
          }
        }
});

    $( "#filmdrag" ).draggable({
       helper: "clone",
       revert: "invalid"
    });

    $( "#vigdrag" ).draggable({
      helper: "clone",
      revert: "invalid",
    });

    $( "#blurdrag" ).draggable({
      helper: "clone",
      revert: "invalid"
    });

    $( "#expdrag" ).draggable({
      connectToSortable: "#sortable",
      helper: "clone",
      revert: "invalid",
      stop: function( event, ui ) {
        // editor.setValue(editor_text);
      }
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

    $(".uploadfirst").click(function(){
        $(".popup").removeClass("hidden");
    });

    $(".uploadbtn").click(function(){
        $(".popup").addClass("hidden");
        $(".video2").removeClass("hidden");
        $(".uploadfirst").addClass("hidden");
        $(".clearHover").addClass("hidden");
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


    $('.slidebtn').click(function() {
      $('#effects').toggleClass("active");
        if ($(this).text() == "Show Sliders")
          {
             $(this).text("Hide Sliders");
          }
          else
          {
             $(this).text("Show Sliders");
          };
    });

    $( "ul, li" ).disableSelection();
    FindCMnums();
       },delay)
});
