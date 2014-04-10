var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var crypto = require('crypto');

// create mongodb
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.MONGOHQ_URL || 'localhost:27017/vidcode');

// configure express
var app = express();
app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser({ keepExtensions: true, limit: '10mb', uploadDir: __dirname +'/vids' }));
app.use(express.urlencoded());
app.use(express.json());
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
app.get('/demo/:token?', routes.demo(db));
app.post('/upload', routes.upload);
app.post('/save', routes.save(db, crypto));

// create server
http.createServer(app).listen(app.get('port'),function(){
  console.log("Listening on " + app.get('port'));
});


