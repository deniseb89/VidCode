$( document ).ready(function() {

  var thumbnails = document.querySelectorAll('.js-fetch-vid');
  var tnExist = thumbnails[0];

  if (tnExist) {
      var delay=1;
      setTimeout(loadThumbnail,delay);
      // loadThumbnail();
  };

  function loadThumbnail(){
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


	$('.sample-vid').click(function(){
    mixpanel.track('Selected a sample video');
		var thisSrc = $(this).attr('src');
		$('.vid-placeholder').addClass('is-hidden');
		$('.loader').removeClass('is-hidden');
		$('.js-vid-click').removeClass('js-selected-video');
		$(this).addClass('js-selected-video');
		movie.addEventListener("loadeddata", showVid, false);
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

  $('.js-slide-right-final').click(function(){
  	slideRight('.js-slide-1', '.js-slide-final');
  	$('.lesson-prompt').text('Wait just a moment as we save your awesome video creation...');
  	movie.play();
  	rafId = requestAnimationFrame(drawVideoFrame);
  	$("body").css("cursor", "progress");
    $('.link-two').attr('disabled',true);
  });

  $('.js-slide-left-first').click(function(){
  	slideLeft('.js-slide-1', '.js-slide-final');
  });


	$('.js-switch-videos').click(function(){
		$('.methodsBox').addClass('is-hidden');
		$(".js-switch-appear").removeClass("is-hidden");
	});

});


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


