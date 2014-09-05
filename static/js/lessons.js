$( document ).ready(function() {

  $(".js-desc").click(function() {
      $('.share-p-text-container').removeClass('is-hidden');
      var buttonTitle = document.getElementById("formTitle").value;
      $(".kaytitle").text(buttonTitle);
      var buttonDesc = document.getElementById("formDesc").value;
      $(".kaydesc").text(buttonDesc);
  });

  instaUser();

	$('.js-vid-click').click(function(){
    $('.vid-placeholder').addClass('is-hidden');
		$('.loader').removeClass('is-hidden');
    $('.js-vid-click').removeClass('js-selected-video');
    $(this).addClass('js-selected-video');
    movie.addEventListener("loadeddata", showVid, false);
    var thisSrc = $(this).attr('src');
    movie.src = thisSrc;
	});

  $('.js-slide-right-final').click(function(){
  	$('.mongoError').addClass('is-hidden');
    slideRight('.js-slide-1', '.js-slide-title');
    movie.load();
    movie.muted = true;
    $('.js-lesson-prompt').text('');    
    $('.progressDiv').removeClass('is-hidden');
    $('#vid-display').addClass('is-hidden');
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


  var loadThumbnail = function (){
    $('.insta-thumbnails').removeClass('is-hidden');
    var username = $('#username').text();
    
    var thumbnail0 = document.getElementById('js-fetch-vid0');
    var n = thumbnail0.getAttribute("name");
    $('#js-fetch-vid0').removeClass('is-hidden');    
    thumbnail0.src = '/instagram/'+username+'/'+n;
    thumbnail0.addEventListener("loadeddata", function(){
    }, false);

    var thumbnail1 = document.getElementById('js-fetch-vid1');
    var n = thumbnail1.getAttribute("name");
    $('#js-fetch-vid1').removeClass('is-hidden');
    thumbnail1.src = '/instagram/'+username+'/'+n;
    thumbnail1.addEventListener("loadeddata", function(){
    }, false);

    var thumbnail2 = document.getElementById('js-fetch-vid2');
    var n = thumbnail2.getAttribute("name");
    $('#js-fetch-vid2').removeClass('is-hidden');
    thumbnail2.src = '/instagram/'+username+'/'+n;
    thumbnail2.addEventListener("loadeddata", function(){
    }, false);
  };

var instaUser = function() {
    var social = $('#social').text();
    if (social=="instagram"){
      var delay=1000;
      setTimeout(loadThumbnail,delay);
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
