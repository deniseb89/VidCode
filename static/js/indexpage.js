$(window).load(function(){
  readCookie();

  function readCookie() {
    if (document.cookie == "") {
    //brand new visitor.
      $('#chromeWarn').modal('show');
    } else {
      var the_cookie = document.cookie;
      the_cookie = unescape(the_cookie);
      the_cookie_split = the_cookie.split(";");
      for (loop=0;loop<the_cookie_split.length;loop++) {
          var part_of_split = the_cookie_split[loop];
          var find_name = part_of_split.indexOf("nfti_date")
          if (find_name!=-1) {
              break;
          } // Close if
      } // Close for
      if (find_name==-1) {
      } else {
        var seconds_in_a_day = 86400000;
        var seconds_in_a_week = 7 * seconds_in_a_day;     
          var date_split = part_of_split.split("=");
          var last = date_split[1];
          var last2 = new Date(last);
          var last2Num = last2.getTime();
          var today = new Date();
          var todayNum = today.getTime();
          var timePassed = todayNum - last2Num;
          if (timePassed>seconds_in_a_week) {
            $('#chromeWarn').modal('show');           
          }
      } 
    }
  } // Close function readCookie()
})


$(document).ready(function () {
    $('.js-fade').fadeIn(1000).removeClass('is-hidden');

  //Intro Page Slider
  $('.js-slide2-right').click(function(){
  	slideRight('.js-slide1', '.js-slide2');
    mixpanel.track('Started the Tour');
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

  $('#mix-finish-tour').click(function(){
    mixpanel.track_links("#mix-finish-tour", "Finished the Tour" );
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