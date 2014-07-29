$( document ).ready(function() {

	$('.js-show-login').click(function(){
		$('.s-popup').removeClass('is-hidden');
		$('body').addClass('is-in-signup');
		$('.b-cover-layer').removeClass('is-hidden');
	});

	$('.b-cover-layer').click(function(){
		$('body').removeClass('is-in-signup');
		$('.s-popup').addClass('is-hidden');
		$('.b-cover-layer').addClass('is-hidden');
	});

});