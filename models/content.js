var lessonContent =
  {
    'basicFilters' : {
      'title': ['What are we writing? Javascript!'],
      'lessonText': ["Javascript is a programming language. Since computers don't speak human languages like English or Spanish, we use programming languages to talk to them.", "All your favorite apps are made by talking to computers with programming languages."],
      'images':['lesson-1-right.png'],
      'learnMore' : [
        {'topic':'What are we writing?', 'target':'#lesson-1-222'},
        {'topic':'Pieces of our code', 'target': '#lesson-3-222'},
        {'topic':'Effects', 'target': '#effects222'}
      ],
      'elements' : ['blur','noise','vignette','exposure', 'fader','kaleidoscope'],
      'class' : 'basic-filter-method'
    },
    'movieControls' : {
      'title': ['What are we writing? Javascript!'],
      'lessonText': ['speed step', 'speed step', 'speed step', 'speed step'],
      'learnMore' : [
        {'topic':'My Movie', 'target':'#movies222'},
        {'topic':'Play', 'target': '#play222'},
        {'topic':'Values: An Overview', 'target': '#lesson-4-222'}
      ],
      'elements' : ['play','pause','playbackRate'],
      'class' : 'movie-control-method'
    },
    'stopMotion' : {
      'title': ["Stop Motion with Code!"],
      'lessonText': ['select images for your animation by clicking the thumbnails you want in your stop-motion animation.', 'drag the "interval" button. This controls how quickly your animation moves! This code uses milliseconds so 1000 is the same as 1 second!'],
      'learnMore' : [
        {'topic':'Objects', 'target':'#lesson-objects-222'},
        {'topic':'Functions', 'target': '#function222'},
        {'topic':'Frame Rate', 'target': ''}
      ],
      'elements' : ['interval', 'frames','reverse'],
      'class' : 'stop-motion-method',
    }
  };

 module.exports = lessonContent;
