$( document ).ready(function() {
	$('.js-vid-click').click(function(){
		$('.loader').removeClass('is-hidden');
		$('.js-vid-click').removeClass('js-selected-video');
		$(this).addClass('js-selected-video');

		movie.addEventListener("loadeddata", showVid, false);
		var thisSrc = $(this).attr('src');

		if ($(this).hasClass('sample-vid')) {
			movie.src = thisSrc;			
		} else {
			$.ajax('/instagram/video',{
		      success: function(data, textStatus, jqXHR){
		        movie.src="data:video/mp4;base64,"+data;
		      },
		      error: function(data, textStatus, jqXHR){
		        $('.loader').addClass('is-hidden');
		        alert("You don't have any Instagram videos :(");
		      }
		    })			
		}
	});
});