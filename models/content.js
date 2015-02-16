var lessonContent =
  {

    'filters' : {
      'name' : 'Filters',
      'total' : 7,
      'elements' : ['blur','noise','vignette','exposure', 'fader'],
      'class' : 'filter-method',
      'learnMore' : [
        {
          'lessonId':'1-1',
          'title': ['What are we writing? JavaScript!'],
          'p1': ['JavaScript is a programming language. Since computers don\'t speak human languages like English or Spanish, we use programming languages to talk to them.'],
          'p2': ['All your favorite apps are made by talking to computers with programming languages.'],
          'pstrong': ['Start your project by selecting media from the left hand corner.'],
          'image':['lesson-1-right.png'],
          'name':'JavaScript!'
        },
        {
          'lessonId':'1-2',
          'title': ['Awesome!'],
          'p1': ['You just made a video play with CODE! Your code is now populating the text editor which speaks to the rest of the computer program and tells it what to do!'],
          'p2':['Go ahead and drag over a filter button on the bottom right. Tell that computer who\'s boss!'],
          'name':'Play'
        },
        {
          'lessonId':'1-3',
          'title': 'You have a filter!',
          'p1': ['The red number you see is the "value" of this line of code.'],
          'p2': ['Go ahead and change that value to customize your effect.'],
          'p3': ['Then bring in another filter!'],
          'name':'Effects II'
        },
        {
          'lessonId':'1-4',
          'p1':['Now that you have 2 filters do you see something in common? \"Effects.\"'],
          'p2':['Effects is an Object. This is a word you will be hearing a lot. Objects hold data. When we write the word "effects" in the editor we are asking to retrieve data from the "effects" object. Computer programs LOVE passing information around.'],
          'btn': ['Take a quiz. →'],
          'name':'Effects II!'
        },
        {
          'lessonId':'1-5',
          'title': ['Quiz'],
          'p1': ['List the names of the effects that are stored in the "effects" object.'],
          'textarea': ["type"],
          'btn': ['Submit'],
          'name':'Effects Quiz'
        },
        {
          'lessonId':'1-6',
          'title': ['Great job!'],
          'p1': ['Now, try typing in a filter that you haven\'t used yet into the text editor. Don\'t drag and drop this time -- just type :)'],
          'phint': ['Get a hint'],
          'btn':['Next →'],
          'name':'Hint'
        },
        {
          'lessonId':'1-7',
          'title': ['Next steps'],
          'p1' : ['Whoa! You did it! Let\'s move on coding PRO! Time to create a stop motion!'],
          'link': {
            'url': '/doc/vocab-sheet-1.pdf',
            'text':'vocab cheat sheet'
          },
          'p2':['download the vocab cheat sheet from Filters to build on as you go.'],
          'btn' : ['Next Lesson: Stop Motion'],
          'name':'Vocab'
        }
      ]
    },
    'stopMotion' : {
      'name' : 'Stop Motion',
      'total' : 9,
      'elements' : ['interval', 'reverse'],
      'class' : 'stop-motion-method',
      'learnMore' : [
        {
          'lessonId':'2-1',
          'title': ['The Power of Code'],
          'p1': ['Now let\'s get creative!'],
          'p2': ['We can make our own stop motion masterpiece with CODE! And you know what\n\'s even more amazing then that?!'],
          'p3': ['Because we are using CODE to create our stop motion we have more control to make it our own that we ever could by a program that someone else wrote. This is yours!'],
          'p4': ['Let\'s go!'],
          'pstrong': ['Start your project by selecting some sample stills on the left or upload your own.'],
          'name':'Stop Motion Intro'
        },
        {
          'lessonId':'2-2',
          'title': ['An Array!'],
          'p1':['Whoa! You made a new line of code appear!'],
          'p2' : ['The thumbs you are selecting are creating a numbered list between those [ ] brackets.  That is a super powerful thing called an "array".  Arrays contain lists of data separted by commas.'],
          'pstrong': 'Once you\'ve selected ALL your images click NEXT',
          'btn': ['Next'],
          'image':['lesson-stop-motion.png'],
          'name':'Arrays'
        },
        {
          'lessonId':'2-3',
          'title': 'Frame it up',
          'p1': ['You\'ve picked your favorite photos and now they are in an array. Hooray!'],
          'pstrong': ['Now drag over the "interval" button'],
          'name':'Frames'
        },
        {
          'lessonId':'2-4',
          'title': 'What did Interval change?',
          'p1': ['Whoa! The images are moving now.'],
          'p2': ['The interval property controls the speed that your stop motion moves!'],
          'p3': ['If only there had been CODE like this back in the day. Think what Charlie Chaplin would have created!'],
          'btn': ['Next'],
          'name':'Interval'
        },
        {
          'lessonId':'2-5',
          'title': 'Remember "Objects"?',
          'p1': ['Now we have a stop motion object.'],
          'p2': ['Anything to the right of the stop motion object is a property that is being pulled out of that object. A property is kind of like an object\'s baby.'],
          'btn': ['Next'],
          'name':'Objects Review'
        },
        {
          'lessonId':'2-6',
          'title': ['Reverse it up!'],
          'pstrong': ['Drag over the "Reverse" button.'],
          'name':'Reverse'
        },
        {
          'lessonId':'2-7',
          'title': ['How does reverse work?'],
          'p1' : ['Reverse is called a "native Javascript method".'],
          'p2' : ['Every time you see those () brackets, that means a method is being called. A method is like an action.'],
          'btn': ['Next'],
          'name':'Methods'
        },
        {
          'lessonId':'2-8',
          'title': ['BEAUTIFUL!'],
          'p1': ['Did you know that stop motion was first used in films back in 1897?  Guess when code was invented?'],
          'p2': ['The world\'s first computer program was written around 1843 by a WOMAN named Ada Lovelace.  Google her LATER! But for now, back to YOUR coding project'],
          'btn': ['Next'],
          'name':'History'
        },
        {
          'lessonId':'2-9',
          'title': ['ADD FILTERS AND SHARE'],
          'p1': ['Go back and add a few filters to your masterpiece.'],
          'p2': ['Select "Filters" from the drop down menu on the top lefthand corner of the screen.'],
          'pstrong': ['Once you\'re done, share your hard earned blood sweat and tears (aka your awesome video)!'],
          'link': {
            'url': '/doc/vocab-sheet-2.pdf',
            'text':'stop motion vocab cheat sheet'
          },
          'name':'Share'
        }
      ],
    },
    'graphics' : {
      'name': 'Graphics',
      'total' : 17,
      'elements' : ['drawing', 'animation'],
      'class' : 'graphic-method',
      'learnMore' : [
        {
          'lessonId':'3-1',
          'title': ['Generative'],
          'p1': ['Ooooo, that\'s a fun word.'],
          'p2':['You can now make a graphic animate on top of your video!'],
          'p3': ['Your stop motion projects were frame based animations - meaning within each frame there was something that moved. Your graphic animation will be generative - meaning it changes with time and based off everlasting calculations!'],
          'link': {
            'url': 'https://processing.org/exhibition/',
            'text': 'check out generative animation artwork here'
          },
          'btn':['Next →'],
          'name':'Generative Graphics'
        },
        {
          'lessonId':'3-2',
          'title': ['Adding Graphics'],
          'p1': ['Now Let\'s get a crazy cool graphic on top of your video!'],
          'pstrong': ['Go ahead and drag in a graphic from your library.'],
          'name':'Adding Graphics'
        },
        {
          'lessonId':'3-3',
          'title': ['Video Magic!'],
          'p1': ['That looks great!'],
          'pstrong': ['Try changing the value of \'size\''],
          'btn':['Changed the size! →'],
          'name':'Changing Variables'
        },
        {
          'lessonId':'3-4',
          'title': ['More variables!'],
          'p1': ['You are in control!  Time to code some movie madness.'],
          'btn': ['What\'s position.x? →'],
          'name':'Size Variable',
        },
        {
          'lessonId':'3-5',
          'title': ['(x,y) Coordinates'],
          'p1': ['An x coordinate!'],
          'p2': ['That\'s the location of where things are placed on your video! Computer programs learn where things are in space by a system of (x,y) coordinates. Remember that from geometry?! ;)'],
          'btn': ['Next →'],
          'name':'(x,y) Coordinates',
        },
        {
          'lessonId':'3-6',
          'title': ['The Pixel Grid'],
          'p1': ['A video is a single grid, with x as horizontal and y as vertical. As shown below!'],
          'pstrong': ['If you wanted to put your graphic on the top right corner of your video player, would x or y be zero?'],
          'textarea': ["type"],
          'btn': ['Submit'],
          'name':'The Pixel Grid',
          'image':['pixel.jpg']
        },
        {
          'lessonId':'3-7',
          'title': ['The Pixel Grid (Answer)'],
          'p1': ['Y would be 0!'],
          'p2': ['As you code more this way of thinking will become more natural.  Just keep practicing!'],
          'btn': ['Next →'],
          'name':'The Pixel Grid (Answer)'
        },
        {
          'lessonId':'3-8',
          'title': ['Onto Animation'],
          'p1': ['Now let\'s make it move!'],
          'pstrong': ['Drag over the animation button.'],
          'name':'Onto Animation'
        },
        {
          'lessonId':'3-9',
          'title': ['Animation'],
          'p1': ['Whoa! It\'s moving and you can see the JavaScript that\'s making it move.'],
          'p2': ['Want to make it stop moving around?'],
          'pstrong': ['What do you think you could change in the code to make it stop? Change it to move on.'],
          'phint': ['Get a hint'],
          'btn': ['Changed it! →'],
          'name':'Animation II'
        },
        {
          'lessonId':'3-10',
          'title': ['True and false'],
          'p1': ['Great job!'],
          'p2': ['Computer programs love 010101 true false true false.'],
          'p3': ['More on that soon!'],
          'btn': ['Next →'],
          'name':'True and False'
        },
        {
          'lessonId':'3-11',
          'title': ['targetPosition.y=0;'],
          'p1': ['What do you think targetPosition.y=0; is?'],
          'p2': ['Before we get to that have you noticed there is a semicolon after each code sentence?'],
          'p3': ['It\'s very similar to the period at the end of an english sentence.  Make sure to keep track of your semicolons!'],
          'btn': ['Next →'],
          'name':'targetPosition.y=0;'
        },
        {
          'lessonId':'3-12',
          'title': ['Speed it up!'],
          'p1': ['Now that you know what targetPosition is what do you think "speed.x=1;" means?'],
          'p2': ['Play around and see!'],
          'btn': ['Next →'],
          'name':'Speed it up!'
        },
        {
          'lessonId':'3-13',
          'title': ['Dot Notations'],
          'p1': ['The speed is an object that is grabbing "property" "x".  Think of it as a way to grab data through a glossary.'],
          'p2': ['In this case we are looking in the book called "speed" for the chapter "x".  It\'s a super powerful way to organize code!'],
          'btn': ['Next →'],
          'name':'Dot Notations'
        },
        {
          'lessonId':'3-14',
          'title': ['Drawing'],
          'p1': ['Now let\'s get to drawing!'],
          'p2': ['You can draw with code! You\'re learning the JavaScript that makes it happen.'],
          'pstrong': ['Drag over the "drawing" button'],
          'name':'Drawing'
        },
        {
          'lessonId':'3-15',
          'title': ['Drawing Quiz'],
          'p1': ['What do you think you need to change in the code to make this drawing happen?'],
          'phint': ['Get a hint'],
          'textarea': ["type"],
          'btn': ['Submit'],
          'name':'Drawing Quiz'
        },
        {
          'lessonId':'3-16',
          'title': ['drawingMode'],
          'p1': ['That\'s it! drawingMode!'],
          'p2': ['It\'s like a light switch that you can turn on or off with true/false.'],
          'phint': ['Get a hint'],
          'btn': ['Next →'],
          'name':'drawingMode'
        },
        {
          'lessonId':'3-17',
          'title': ['Finishing Up Graphics'],
          'p1': ['Play around with the color and settings then export your masterpiece!'],
          'p2': ['Make sure to download the vocab sheet!'],
          'link': {
            'url': '/doc/vocab-sheet-3.pdf',
            'text':'graphics vocab cheat sheet'
          },
          'name':'Finishing Up Graphics'
        }
      ]
    },
    'pixelate' : {
      'name': 'Pixelate',
      'total': 1,
      'elements' : ['pixel grid', 'shape', 'background color', 'pixels color', 'audio reactive', 'motion detection'],
      'class' : 'pixelate-method',
      'learnMore' : [
        {
          'lessonId':'4-1',
          'title': [''],
          'p1': [''],
          'name':'',
        }
      ]
    }
  };

 module.exports = lessonContent;
