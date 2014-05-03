$(document).ready(function () {
    $('.js-fade').fadeIn(1000).removeClass('is-hidden');


  //Intro Page Slider
  $('.js-slide2-right').click(function(){
  	slideRight('.js-slide1', '.js-slide2');
  });

  $('.js-slide3-right').click(function(){
  	slideRight('.js-slide2', '.js-slide3');
  });

  $('.js-slide4-right').click(function(){
  	slideRight('.js-slide3', '.js-slide4');
  });


  $('.js-slide1-left').click(function(){
  	slideLeft('.js-slide1', '.js-slide2');
  });

  $('.js-slide2-left').click(function(){
  	slideLeft('.js-slide2', '.js-slide3');
  });

  $('.js-slide3-left').click(function(){
  	slideLeft('.js-slide3', '.js-slide4');
  });

});

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

var slideLeft = function(oldSlide, newSlide){
	$(newSlide).addClass('is-hidden');
	$(oldSlide).removeClass('is-hidden');
	$(oldSlide).animate({
    opacity: 1,
    'margin-left': "0px"
    });
}