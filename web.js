var express = require('express');
var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var fs = require('fs');
var http = require('http');
var path = require('path');
var crypto = require('crypto');
var util = require('util');
var config = require('./config');
var passport = require('passport');
var InstagramStrategy = require('./models/passport-instagram').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy

// create mongodb
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.MONGOHQ_URL || 'localhost:27017/vidcode');

passport.serializeUser(function(user, done) {
  console.log('serializing');
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('deserializing');
  console.log(user);
    var vc = db.get('vidcode');
    vc.findOne({id: user.id , "social": user.provider}, function (err, doc) {
      done(err, user);
    });
});

// passport-facebook auth
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID || config.FACEBOOK_APP_ID_LOCAL,
      clientSecret: process.env.FACEBOOK_APP_SECRET || config.FACEBOOK_APP_SECRET_LOCAL,
      callbackURL: process.env.FACEBOOK_CB ||  "http://localhost:8080/auth/facebook/cb"         
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      return done(null, profile);
    })
    // User.findOrCreate({facebookId: profile.id}, function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
  }
));

// passport-instagram auth
passport.use(new InstagramStrategy({
    clientID: process.env.INSTAGRAM_CLIENT_ID|| config.INSTAGRAM_CLIENT_ID_LOCAL,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || config.INSTAGRAM_CLIENT_SECRET_LOCAL,    
    callbackURL: process.env.INSTAGRAM_CB || "http://localhost:8080/auth/instagram/cb"
  },
  function(accessToken, refreshToken, profile, done) {
    var vc = db.get('vidcode');
    // vc.findOrCreate({ id: profile.id  , "social":"instagram"}, function (err, user) {
    //   return done(err, user);
    // });
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// configure express
var app = express();
var environ = app.get('env');
app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(cookieParser('my 114 o2o'));
app.use(session({
  secret: 'secret kitty'
  // secureProxy: false // if you do SSL outside of node
}))

console.log(environ);

app.use(passport.initialize());
app.use(passport.session());

// configure express template engine
var exphbs = require('express3-handlebars');
app.set('views', __dirname + '/views');
app.engine('.html', exphbs({ defaultLayout: 'main', extname: '.html' }));
app.set('view engine', '.html');

// configure express routes
var routes = require('./routes');
app.get('/',routes.signin);
app.get('/googleForm',routes.indexGF);
app.get('/intro/:social?/:id?', routes.intro(db));
app.get('/filters/:token?', routes.filters(db));
app.get('/scrubbing', routes.scrubbing(db));
app.get('/gallery', routes.gallery);
app.get('/galleryshow', routes.galleryshow);
app.get('/share/:url?', routes.share(db));

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
app.post('/signup', routes.signup(db));

app.get('/auth/instagram', passport.authenticate('instagram'), function(req, res){});
app.get('/auth/instagram/cb', passport.authenticate('instagram', { failureRedirect: '/' }), routes.igCB(db));

app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res){});
app.get('/auth/facebook/cb', passport.authenticate('facebook', { failureRedirect: '/' }), routes.fbCB(db));

app.get('/instagram/:media', routes.igGet);
app.get('/awsUpload', routes.awsUpload);

// create server
http.createServer(app).listen(app.get('port'),function(){
  console.log("Listening on " + app.get('port'));
});
