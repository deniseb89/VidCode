var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var crypto = require('crypto');
var util = require('util');
var config = require('./config');
var passport = require('passport');
var InstagramStrategy = require('./models/passport-instagram').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy

// create mongodb
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.MONGOHQ_URL || 'localhost:27017/vidcode');


// passport-facebook auth
// var passport = require('passport')
//   , FacebookStrategy = require('passport-facebook').Strategy;

// passport.use(new FacebookStrategy({
//     clientID: config.FACEBOOK_APP_ID,
//     clientSecret: config.FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:8080/auth/facebook/cb"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate({facebookId: profile.id}, function(err, user) {
//       if (err) { return done(err); }
//       done(null, user);
//     });
//   }
// ));


// passport-instagram auth
var INSTAGRAM_CLIENT_ID = "f8348c57bbdb4f25bfd7b0776a84f09b";
var INSTAGRAM_CLIENT_SECRET = "3fcbb0b63c094ca798d9430a81fe123a";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new InstagramStrategy({
    clientID: INSTAGRAM_CLIENT_ID,
    clientSecret: INSTAGRAM_CLIENT_SECRET,
    callbackURL: "http://vidcode.herokuapp.com/auth/instagram/cb"
    // callbackURL: "http://localhost:8080/auth/instagram/cb"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// configure express
var app = express();
app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser({ keepExtensions: true, limit: '25mb', uploadDir: __dirname +'/vids' }));
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// configure express template engine
var exphbs = require('express3-handlebars');
app.set('views', __dirname + '/views');
app.engine('.html', exphbs({ defaultLayout: 'main', extname: '.html' }));
app.set('view engine', '.html');

// configure express routes
var routes = require('./routes');
app.get('/',routes.index);
app.get('/1',routes.index);
app.get('/2',routes.index2);
app.get('/3',routes.index3);
app.get('/g',routes.indexG);
app.get('/googleForm',routes.indexGF);
app.get('/intro', routes.intro);
app.get('/filters/:token?', routes.filters(db));
app.get('/scrubbing', routes.scrubbing(db));
app.get('/gallery', routes.gallery);
app.get('/galleryshow', routes.galleryshow);
app.get('/share', routes.share);

app.get('/signin', routes.signin);

app.get('/demotest', routes.oldDemo2);

//------lesson template ----------//
app.get('/lesson/1', routes.partone(db));
app.get('/lesson/2', routes.parttwo);
app.get('/lesson/3', routes.partthree);
app.get('/lesson/4', routes.partfour);

app.get('/codeAlone', routes.codeAlone);
app.post('/upload', routes.upload);
app.post('/save', routes.save(db, crypto));
app.get('/auth/instagram', passport.authenticate('instagram'), function(req, res){});
app.get('/auth/instagram/cb', passport.authenticate('instagram', { failureRedirect: '/' }), routes.igCB);

app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res){});
app.get('/auth/facebook/cb', passport.authenticate('facebook', { failureRedirect: '/' }), routes.fbCB);

app.get('/instagram/:media', routes.igGet);
app.get('/awsUpload', routes.awsUpload);

// create server
http.createServer(app).listen(app.get('port'),function(){
  console.log("Listening on " + app.get('port'));
});
