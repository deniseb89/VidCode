var express = require('express');
var bodyParser = require('body-parser');
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
  done(null, user);
});

passport.deserializeUser(function(user, done) {
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
app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(cookieParser('my 114 o2o'));
app.use(session({
  secret: 'secret kitty',
  maxAge: 1000*60*60*24
  // secureProxy: false // if you do SSL outside of node
}))

console.log('app.get says: '+app.get('env'));
console.log('process.env says '+process.env.NODE_ENV);
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
app.get('/signin', routes.signin);
app.get('/intro/:social?/:id?', routes.intro(db));
app.get('/lesson/1', routes.partone(db));
app.get('/share/:token?', routes.share(db));
app.get('/notFound', routes.notFound);
app.get('/gallery', routes.gallery);
app.get('/galleryshow', routes.galleryshow);

// app.get('/filters/:token?', routes.filters(db));
// app.get('/scrubbing', routes.scrubbing(db));

//sign up + sign in
app.post('/signup', routes.signup(db));
app.get('/auth/instagram', passport.authenticate('instagram'), function(req, res){});
app.get('/auth/instagram/cb', passport.authenticate('instagram', { failureRedirect: '/' }), routes.igCB(db));
app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res){});
app.get('/auth/facebook/cb', passport.authenticate('facebook', { failureRedirect: '/' }), routes.fbCB(db));

//getting and sending videos
app.get('/instagram/:media', routes.igGet);
app.get('/save', routes.save(db));
app.get('/userVid', routes.getUserVid)
app.post('/upload', routes.upload(mongo,db,crypto));

// create server
http.createServer(app).listen(app.get('port'),function(){
  console.log("Listening on " + app.get('port'));
});
