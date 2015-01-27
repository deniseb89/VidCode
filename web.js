// required packages  ==========================================================
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var mongoose = require('mongoose');
var morgan = require('morgan');

// configure mongo =============================================================
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

var seeder = require('./config/seeder');
mongoose.connection.on('open', function() {
  console.log("Connected to Mongoose...");

  // check if the db is empty, if so seed it:
  seeder.check();
});

// pass passport for configuration =============================================
require('./config/passport')(passport);

// configure express ===========================================================
var app = express();
app.use(morgan('dev')); // log every request to the console
app.set('port', process.env.PORT || 5000);
app.use(express.static(__dirname + '/static'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'secret kitty',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    resave: true,
    saveUninitialized: true
    // secureProxy: false // if you do SSL outside of node
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// configure express template engine ===========================================
app.set('views', __dirname + '/views');
app.engine('.html', exphbs({defaultLayout: 'main', extname: '.html'}));
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
  app.get('/intro/:trial?', routes.intro(db));
  app.get('/trial', routes.trial(db));
  app.get('/trialintro', routes.trialintro(db));
  app.get('/workstation', routes.workstation(db));

  app.get('/lesson/1', function(req, res){
    res.redirect('/workstation');
  });
  app.get('/share/:token?', routes.share(db));

  // sign up + sign in
  app.post('/signup', routes.signup(db));
  app.post('/preorder', routes.preOrderSignUp(db));
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
  app.post('/uploadMedia', routes.uploadMedia(db,gfs,crypto));

  //catch all for any other request attempts
  app.get('*', function(req,res){
    res.render('404',{layout: false});
  });

  http.createServer(app).listen(app.get('port'),function(){
    console.log("Listening on " + app.get('port'));
  });

app.listen(app.get('port'));
console.log('Listening on ' + app.get('port'));
