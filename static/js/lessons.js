$( document ).ready(function() {

  $(".js-desc").click(function() {
      $('.share-p-text-container').removeClass('is-hidden');
      var buttonTitle = document.getElementById("formTitle").value;
      $(".kaytitle").text(buttonTitle);
      var buttonDesc = document.getElementById("formDesc").value;
      $(".kaydesc").text(buttonDesc);
      //resend form here if title/desc is updated      
  });

  loadThumbnails();

	$('.js-vid-click').click(function(){
		$('.loader').removeClass('is-hidden');
    $('.js-vid-click').removeClass('js-selected-video');
    $(this).addClass('js-selected-video');
    movie.addEventListener("loadeddata", showVid, false);
    var thisSrc = $(this).attr('src');
    movie.src = thisSrc;
	});

  $('.js-slide-right-final').click(function(){
    slideRight('.js-slide-1', '.js-slide-title');
    movie.load();
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


});

var loadThumbnails = function() {
  var social = $('#social').text();

  if (social=="instagram"){
    $.ajax('/instagramVids',{
      success: function(data, textStatus, jqXHR){
        var igVids = data;
        if (igVids.length){
          for (var i=0; i < Math.min(igVids.length,3); i++){
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
}

var slideLeft = function(oldSlide, newSlide){
	$(newSlide).addClass('is-hidden');
	$(oldSlide).removeClass('is-hidden');
	$(oldSlide).animate({
    opacity: 1,
    'margin-left': "0px"
    });
}

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
}
