$( document ).ready(function() {

	$('.sample-vid').click(function(){
		$('.loader').removeClass('is-hidden');
		$('.js-vid-click').removeClass('js-selected-video');
		$(this).addClass('js-selected-video');

		movie.addEventListener("loadeddata", showVid, false);
		var thisSrc = $(this).attr('src');
			movie.src = thisSrc;				
	});

	$('.js-fetch-vid').click(function(){
		$('.loader').removeClass('is-hidden');
		//go get video based on # in quadrant
		var n = $(this).attr("name");
		$.ajax('/instagram/'+n,{
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

	// $('#js-fetch-vid1').click(function(){
	// 	//go get video based on # in quadrant
	// 	$.ajax('/instagram/1',{
	//       success: function(data, textStatus, jqXHR){
	//         movie.src="data:video/mp4;base64,"+data;
	//       },
	//       error: function(data, textStatus, jqXHR){
	//         $('.loader').addClass('is-hidden');
	//         // alert("You don't have any Instagram videos :(");
	//       }
	//     })		
	// });

  $('.js-slide-right-final').click(function(){
  	slideRight('.js-slide-1', '.js-slide-final');
  	$('.lesson-prompt').text('Wait just a moment as we save your video creation...');
  	movie.play();
  	rafId = requestAnimationFrame(drawVideoFrame);
  	$("body").css("cursor", "progress");
    $('.link-two').attr('disabled',true);
  });

  $('.js-slide-left-first').click(function(){
  	slideLeft('.js-slide-1', '.js-slide-final');
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