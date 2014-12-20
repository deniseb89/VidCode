
var express = require('express');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var fs = require('fs');
var http = require('http');
var path = require('path');
var crypto = require('crypto');
var util = require('util');
var passport = require('passport');
var InstagramStrategy = require('./models/passport-instagram').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var Grid = require("gridfs-stream");

// create mongodb
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var host = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/vidcode';
var gfs; //grid-fs object
var db; //a copy of db object
//var monk = require('monk');
//var db = monk(process.env.MONGOHQ_URL || 'localhost:27017/vidcode');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    var vc = db.collection('vidcode');
    vc.findOne({id: user.id , "social": user.provider}, function (err, doc) {
      done(err, user);
    });
});

/*
Adam J. Mendoza
NOTE: Disabled facebook and Instagram authentication for now since I don't have 
the tockens to put in the package Strategy files.
*/

// passport-facebook auth
//var passport = require('passport')
//  , FacebookStrategy = require('passport-facebook').Strategy;

/*
passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CB
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      return done(null, profile);
    })
  }
));
*/

// passport-instagram auth
/*
passport.use(new InstagramStrategy({
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: process.env.INSTAGRAM_CB
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));
*/
// configure express
var app = express();
app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret kitty',
  maxAge: 1000*60*60*24
  // secureProxy: false // if you do SSL outside of node
}))

app.use(passport.initialize());
app.use(passport.session());

// configure express template engine
var exphbs = require('express3-handlebars');
app.set('views', __dirname + '/views');
app.engine('.html', exphbs({ defaultLayout: 'main', extname: '.html' }));
app.set('view engine', 'html');

// configure express routes
var routes = require('./routes');

// create server
// connect to Mongo
MongoClient.connect(host, function(err, Db) {
  if (err) throw err;
  db = Db;
  var collection = db.collection('vidcode');
  gfs = Grid(db, mongo);
  console.log('connected to Mongo database');

  app.get('/',routes.signin);
  app.get('/signin', routes.signin);
  app.get('/intro/:social?/:id?', routes.intro(db));
  app.get('/csweek', routes.csweek);
  app.get('/lesson/1', routes.partone(db));
  // app.get('/lesson/tc2', routes.lessontwo(db));
  // app.get('/lesson/tc3', routes.lessonthree(db));
  app.get('/share/:token?', routes.share(db));
  app.get('/profile', routes.profilePage(db))
  app.get('/gallery', routes.gallery);
  app.get('/galleryshow', routes.galleryshow);

  app.get('/lesson/cs1', routes.cs1(db));

  // sign up + sign in
  app.post('/signup', routes.signup(db));
  app.get('/auth/instagram', passport.authenticate('instagram'), function(req, res){});
  app.get('/auth/instagram/cb', passport.authenticate('instagram', { failureRedirect: '/' }), routes.igCB(db));
  app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res){});
  app.get('/auth/facebook/cb', passport.authenticate('facebook', { failureRedirect: '/' }), routes.fbCB(db));

  //getting and sending videos
  app.get('/instagramVids/', routes.igUrlGet(db));
  app.get('/instagram/:ix', routes.igVidGet(db));
  app.get('/sample/:file', routes.getSample);
  app.get('/getVideos', routes.getAllVids(db));  
  app.get('/video', routes.getUserVid(gfs));
  app.post('/uploadFinished', routes.uploadFinished(db,gfs,crypto));

  //catch all for any other request attempts
  app.get('*', function(req,res){
    res.render('404',{layout: false});
  });
  
  http.createServer(app).listen(app.get('port'),function(){
    console.log("Listening on " + app.get('port'));
  });

});