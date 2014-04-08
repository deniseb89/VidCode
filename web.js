var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');

// create mongodb
var mongo = require('mongodb');
var monk = require('monk');
var dbconn = process.env.MONGOHQ_URL || 'localhost:27017/vidcode';
var db = monk(dbconn);

// configure express
var app = express();
app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser({ keepExtensions: true, limit: '10mb', uploadDir: __dirname +'/vids' }));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

// configure express template engine
var engines = require('consolidate');
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

// configure express routes
var routes = require('./routes');
app.get('/', routes.index);
app.get('/demo', routes.demo(dbconn, db));
app.post('/upload', routes.upload);

// create server
http.createServer(app).listen(app.get('port'),function(){
  console.log("Listening on " + app.get('port'));
});


