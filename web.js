// required packages  ==========================================================
var express = require('express');
var exphbs = require('express3-handlebars');
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

// routes ======================================================================
// load our routes and pass in our app and fully configured passport
require('./routes')(app, passport);

app.listen(app.get('port'));
console.log('Listening on ' + app.get('port'));