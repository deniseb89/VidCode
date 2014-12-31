var lessonContent =
  {
    'basicFilters' : {
      'instructions': ['basic step', 'basic step', 'basic step 2', 'something else'],
      'learnMore' : [
        {'topic':'What are we writing?', 'target':'#lesson-1-222'},
        {'topic':'Pieces of our code', 'target': '#lesson-3-222'},
        {'topic':'Effects', 'target': '#effects222'}
      ],
      'elements' : ['blur','noise','vignette','exposure', 'fader','kaleidoscope','saturation'],
      'class' : 'basic-filter-method'
    },
    'movieControls' : {
      'instructions': ['speed step', 'speed step', 'speed step', 'speed step'],
      'learnMore' : [
        {'topic':'My Movie', 'target':'#movies222'},
        {'topic':'Play', 'target': '#play222'},
        {'topic':'Values: An Overview', 'target': '#lesson-4-222'}
      ],
      'elements' : ['play','pause','playbackRate'],
      'class' : 'movie-control-method'
    },
    'stopMotion' : {
      'instructions': ['select images for your animation by clicking the thumbnails you want in your stop-motion animation.', 'drag the "interval" button. This controls how quickly your animation moves! This code uses milliseconds so 1000 is the same as 1 second!'],
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
