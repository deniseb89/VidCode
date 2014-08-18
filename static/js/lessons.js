$( document ).ready(function() {

  $(".submit").click(function() {
        var buttonTitle = document.getElementById("formTitle").value;
        $(".kaytitle").text(buttonTitle);
        var buttonDesc = document.getElementById("formDesc").value;
        $(".kaydesc").text(buttonDesc);
  })

  instaUser();

	$('.sample-vid').click(function(){
    mixpanel.track('Selected a sample video');
		$('.vid-placeholder').addClass('is-hidden');
		$('.loader').removeClass('is-hidden');
		$('.js-vid-click').removeClass('js-selected-video');
		$(this).addClass('js-selected-video');
		movie.addEventListener("loadeddata", showVid, false);
    var thisSrc = $(this).attr('src');
		movie.src = thisSrc;
	});

	$('.js-fetch-vid').click(function(){
    var username = $('#username').text();
    $('.vid-placeholder').addClass('is-hidden');
		$('.loader').removeClass('is-hidden');
    $(this).addClass('js-selected-video');
		//go get video based on # in quadrant
		var n = $(this).attr("name");
		$.ajax('/instagram/'+username+'_'+n,{
	      success: function(data, textStatus, jqXHR){
			movie.addEventListener("loadeddata", showVid, false);
	        movie.src="data:video/mp4;base64,"+data;
	      },
	      error: function(data, textStatus, jqXHR){
	        $('.loader').addClass('is-hidden');
	        // alert("You don't have any Instagram videos :(");
	      }
	    })
	});

  $('.js-slide-right-title').click(function(){
    slideRight('.js-slide-title', '.js-slide-final');
  });

  $('.js-slide-right-final').click(function(){
  	$('.mongoError').addClass('is-hidden');		
    slideRight('.js-slide-1', '.js-slide-title');
    $('.lesson-prompt').text('Wait just a moment as your awesome video creation is saving...');  
    movie.load();
    rafId = requestAnimationFrame(drawVideoFrame);      
  });

  $('.js-slide-left-title').click(function(){
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
    $.ajax('/instagram/'+username+'_'+n,{
        success: function(data, textStatus, jqXHR){
          $('#js-fetch-vid0').removeClass('is-hidden');
          thumbnail0.src = "data:video/mp4;base64,"+data;
          thumbnail0.addEventListener("loadeddata", function(){
          }, false);
        },
        error: function(data, textStatus, jqXHR){
          $('#js-fetch-vid0').parent().addClass('is-hidden');
          $('.loader').addClass('is-hidden');
          //Todo: display different error if there is a loading problem
          $('.i-error').text("You don't have any Instagram videos :(");
        }
      })

    var thumbnail1 = document.getElementById('js-fetch-vid1');
    var n = thumbnail1.getAttribute("name");

    $.ajax('/instagram/'+username+'_'+n,{
        success: function(data, textStatus, jqXHR){
          $('#js-fetch-vid1').removeClass('is-hidden');
          thumbnail1.src = "data:video/mp4;base64,"+data;
          thumbnail1.addEventListener("loadeddata", function(){
          }, false);
        },
        error: function(data, textStatus, jqXHR){
          $('#js-fetch-vid1').parent().addClass('is-hidden');
          $('.loader').addClass('is-hidden');
        }
      })

    var thumbnail2 = document.getElementById('js-fetch-vid2');
    var n = thumbnail2.getAttribute("name");

    $.ajax('/instagram/'+username+'_'+n,{
        success: function(data, textStatus, jqXHR){
          $('#js-fetch-vid2').removeClass('is-hidden');
          thumbnail2.src = "data:video/mp4;base64,"+data;
          thumbnail2.addEventListener("loadeddata", function(){
          }, false);
        },
        error: function(data, textStatus, jqXHR){
          $('#js-fetch-vid2').parent().addClass('is-hidden');
          $('.loader').addClass('is-hidden');
        }
      })
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
