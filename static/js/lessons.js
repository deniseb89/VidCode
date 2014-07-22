$( document ).ready(function() {
	$('.js-vid-click').click(function(){
		$('.js-vid-click').removeClass('js-selected-video');
		$(this).addClass('js-selected-video');

		var thisSrc = $(this).attr('src');
		$('.js-current-vid').attr('src', thisSrc);
	});

  $('.js-slide-right-final').click(function(){
  	slideRight('.js-slide-1', '.js-slide-final');
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