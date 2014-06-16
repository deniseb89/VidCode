$( document ).ready(function() {
  $('.js-heart-click').click(function(){
  	$(this).addClass('is-hidden');
  	$(this).next().removeClass('is-hidden');
  });

  $('.js-heart-clicked').click(function(){
  	$(this).addClass('is-hidden');
  	$(this).prev().removeClass('is-hidden');
  });
});