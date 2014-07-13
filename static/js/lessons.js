$( document ).ready(function() {
	$('.js-vid-click').click(function(){
		$('.js-vid-click').removeClass('js-selected-video');
		$(this).addClass('js-selected-video');

		var thisSrc = $(this).attr('src');
		$('.js-current-vid').attr('src', thisSrc);
	});

});