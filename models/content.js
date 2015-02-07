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
          'p1': ['JavaScript is a programming language. Since computers don\n\'t speak human languages like English or Spanish, we use programming languages to talk to them.'],
          'p2': ['All your favorite apps are made by talking to computers with programming languages.'],
          'pstrong': ['Start your project by selecting media from the left hand corner.'],
          'image':['lesson-1-right.png'],
          'name':'JavaScript!'
        },
        {
          'lessonId':'1-2',
          'title': ['Awesome!'],
          'p1': ['You just made a video play with CODE! Your code is now populating the <strong>text editor</strong> which speaks to the rest of the computer program and tells it what to do!'],
          'p2':['Go ahead and <strong>drag over a filter button on the bottom right.</strong> Tell that computer who\'s boss!'],
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
          'p1':['Now that you have 2 filters do you see something in common? \n\"Effects.\n\"'],
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
          'p1': ['Now, try typing in a filter that you haven\n\'t used yet into the text editor. Don\n\'t drag and drop this time -- just type :)'],
          'p2': ['Get a hint'],
          'btn':['Next →'],
          'name':'Hint'
        },
        {
          'lessonId':'1-7',
          'title': ['Next steps'],
          'p1' : ['Whoa! You did it! Let\n\'s move on coding PRO! Time to create a stop motion! Go ahead and download the vocab cheat sheet from Filters to build on as you go.'],
          'btn' : ['Next Lesson: Stop Motion'],
          'name':'Vocab'
        }
      ]
    },
    'stopMotion' : {
      'name' : 'Stop Motion',
      'total' : 5,
      'elements' : ['interval', 'frames'],
      'class' : 'stop-motion-method',
      'learnMore' : [
        {
          'lessonId':'2-1',
          'title': ['The Power of Code'],
          'p1': ['Now let\n\'s get creative!'],
          'p2': ['We can make our own stop motion masterpiece with CODE! And you know what\n\'s even more amazing then that?!'],
          'p3': ['Because we are using CODE to create our stop motion we have more control to make it our own that we ever could by a program that someone else wrote. This is yours!'],
          'p4': ['Let\n\'s go!'],
          'name':'Stop Motion Intro'
        },
        {
          'lessonId':'2-2',
          'title': ['Awesome!'],
          'p1':['Drag in the "frames" button. Select your favorite stills. Now, drag over the "Interval" button into the code editor.'],
          'image':['lesson-stop-motion.png'],
          'name':'Frames'
        },
        {
          'lessonId':'2-3',
          'title': 'What did Interval change?',
          'p1': ['Whoa! The images are moving now.'],
          'p2': ['Remember "Objects"? Now we have a stop motion Object.'],
          'p3': ['Anything to the right of the stop motion object is a property that is being pulled out of that object. A property is kind of like an object\n\'s baby.'],
          'p4': ['Objects can have millions of properties!'],
          'btn': ['More about interval'],
          'name':'Interval'
        },
        {
          'lessonId':'2-4',
          'title': ['More about Interval'],
          'p1':['The interval property controls the speed that your stop motion moves!'],
          'p2': ['If only there had been CODE like this back in the day, think what Charlie Chaplin would have created!'],
          'p3': ['Your code uses milliseconds so 1000 is the same as one second!'],
          'btn': ['What\n\'s Next?'],
          'name':'Interval II'
        },
        {
          'lessonId':'2-5',
          'title': ['Reverse it up!'],
          'p1': ['Reverse is a property that takes values that are either true or false (it\n\'s called a boolean, we\n\'ll go over more on that weird word later)'],
          'p2': ['How can you make the video reverse? Give it a go! There are no wrong answers! Just discoveries on the way to the right answer! Coding is ALL about trying and failing then eventually… finding the answer! (cue triumphant music!)'],
          'pstrong': ['Drag over the "Reverse" button.'],
          'name':'Reverse'
        }
      ],
    },
    'graphics' : {
      'name': 'Graphics',
      'total' : 6,
      'elements' : ['drawing', 'animation'],
      'class' : 'graphic-method',
      'learnMore' : [
        {
          'lessonId':'3-1',
          'title': ['Generative'],
          'p1': ['Ooooo, that\n\'s a fun word.'],
          'p2':['You can now make a graphic animate on top of your video!'],
          'p3': ['Your stop motion projects were frame based animations - meaning within each frame there was something that moved. Your graphic animation will be generative - meaning it changes with time and based off everlasting calculations!'],
          'link': {
            url: 'https://processing.org/exhibition/',
            text: 'check out generative animation artwork here'
          },
          'btn':['Next'],
          'name':'Generative Graphics'
        },
        {
          'lessonId':'3-2',
          'title': ['Generative'],
          'p1': ['Ooooo, that\n\'s a fun word.'],
          'name':'Generative Graphics',
          'image':['pixel.png']
        },
        {
          'lessonId':'3-3',
          'title': ['Generative'],
          'p1': ['Ooooo, that\n\'s a fun word.'],
          'name':'Generative Graphics',
          'image':['pixel.png']
        },
        {
          'lessonId':'3-4',
          'title': ['Generative'],
          'p1': ['Ooooo, that\n\'s a fun word.'],
          'name':'Generative Graphics',
        }
      ]
    },
    'pixelate' : {
      'name': 'Pixelate',
      'total': 10,
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
