$(document).ready(function () {
    $('.js-fade').fadeIn(1000).removeClass('hidden');


  //Intro Page Slider
  $('.js-slide2-right').click(function(){
  	slideRight('.js-slide1', '.js-slide2');
  });

  $('.js-slide3-right').click(function(){
  	slideRight('.js-slide2', '.js-slide3');
  });


  $('.js-slide1-left').click(function(){
  	slideLeft('.js-slide1', '.js-slide2');
  });

  $('.js-slide2-left').click(function(){
  	slideLeft('.js-slide2', '.js-slide3');
  });

});

var slideRight = function(oldSlide, newSlide){
	$(oldSlide).animate({
    'margin-left': "-200px",
    opacity: 0
    }, function() {
      $(oldSlide).addClass('hidden');
    });
  setTimeout(function(){
  	$(newSlide).removeClass('hidden');
  }, 500);
}

var slideLeft = function(oldSlide, newSlide){
	$(newSlide).addClass('hidden');
	$(oldSlide).removeClass('hidden');
	$(oldSlide).animate({
    opacity: 1,
    'margin-left': "0px"
    });
}