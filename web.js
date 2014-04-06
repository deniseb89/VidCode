var express = require('express')
 , fs      = require('fs')
 , http    = require('http')
 , path    = require('path');

var app = express();
app.set('port', process.env.PORT || 8080);
app.use(express.bodyParser({
				keepExtensions: true,
				limit: 10000000, // 10M limit
				uploadDir: __dirname +'/vids' }));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/static'));

var engines = require('consolidate');
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.get("/", function(req, res) {
  res.render('index.html');
});


app.get("/demo", function (req, res) {
	res.render('demo.html');
});


app.post("/upload", function (req, res) {

	//get the file name
	console.log(req.files.length);
	var filename=req.files.file.name;
	var extensionAllowed=[".mp4",".mov"];
	var maxSizeOfFile=10000000;
	var msg="";
	var i = filename.lastIndexOf('.');

	// get the temporary location of the file
    var tmp_path = req.files.file.path;

	// set where the file should actually exists - in this case it is in the "images" directory
    var target_path = __dirname +'/upload/' + req.files.file.name;

    var file_extension= (i < 0) ? '' : filename.substr(i);
	if((file_extension in oc(extensionAllowed))&&((req.files.file.size /1024 )< maxSizeOfFile)){
		fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
			fs.unlink(tmp_path, function() {
				if (err) throw err;
			});
		});
	}else{
	// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
		fs.unlink(tmp_path, function(err) {
            if (err) throw err;
        });
		msg="File upload failed.File extension not allowed and size must be less than "+maxSizeOfFile;
	}
	res.status(302);
	res.setHeader("Location", "/");
	res.end();
});

function oc(a){
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}

http.createServer(app).listen(app.get('port'),function(){
  console.log("Listening on " + app.get('port'));
});


