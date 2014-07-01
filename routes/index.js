var fs = require('fs');
var request = require('request');

exports.index = function (req, res) {
  res.render('index', { title: 'VidCode' });
};

exports.gallery = function (req, res) {
  var userVidURL = req.query.userVidURL;
  if(userVidURL){
    userVidURL = "blob:"+ userVidURL.substr(5).replace(/:/g,"%3A");
  };
  res.render('gallery', {title: 'VidCode Gallery', userVidURL:userVidURL});
};

exports.galleryshow = function (req, res) {
  res.render('galleryshow', {title: 'VidCode Gallery' });
};

exports.demo = function (db) {
  return function (req, res) {
    var user = req.user;
    var token = req.params.token;
    var filters = ['exposure', 'blur','noise' ,'vignette', 'sepia'];

    if (!token) {
      
    var codeText =
"\
 \n\
 //This line of code makes your movie play!\n\
 movie.play();\n\
 //See what happens when you type movie.pause();\n\
\n\
 //The code below lets you add, remove, and alter your video filters.\n\
 //Change the numbers and make your video all your own!\n\
    ";

      res.render('demo', {code: codeText, filters: filters, user: req.user});
      return;
    }

    var vc = db.get('vidcode');
    vc.findOne({ token: token }, function (err, doc) {
      if (!doc) {
        res.status(404);
      }
        res.render('demo', {code: doc.code , filters: filters});
    });
  };
};

exports.demo2 = function (db) {
  return function (req, res) {
    var user = req.user;
    var token = req.params.token;
    var filters = [ 'fader','sepia'];

    if (!token) {
      var codeText =
"\
 \n\
 //Remember this?\n\
 movie.play();\n\
\n\
 //playbackRate controls the speed of your video. The \"rate\" tells how fast your frames per second (FPS) are going.\n\
 movie.playbackRate = 1.0;\n\
 //\"fader\" is a cool way to add a layer of color over your effect. You can change how \"see through\" this color is with the \"amount\".\n\
    ";
      res.render('demo2', {code: codeText, filters:filters, user:req.user});
      return;
    }

    var vc = db.get('vidcode');
    vc.findOne({ token: token }, function (err, doc) {
      if (!doc) {
        res.status(404);
      }
        res.render('demo2', {code: doc.code });
    });
  };
};

exports.save = function (db, crypto) {
  return function (req, res) {
    var code = req.body.codemirror;
    var token = req.body.token;

    if (!token) {
      token = generateToken(crypto);
      save(db, token, token, code);
    }

    res.redirect('/demo/' + token);
  };
};

exports.upload = function (req, res) {
  var filename = req.files.file.name;
  var extensionAllowed = [".mp4", ".mov",".MOV"];
  var maxSizeOfFile = 25000000;
  var msg = "";
  var i = filename.lastIndexOf('.');

  // get the temporary location of the file
  var tmp_path = req.files.file.path;
  var target_path = './vids/' + filename;
  var file_extension = (i < 0) ? '' : filename.substr(i);

  if ((file_extension in oc(extensionAllowed)) && ((req.files.file.size / 1024) < maxSizeOfFile)) {
    // deal with renaming file
    fs.rename(tmp_path, target_path, function (err) {
      if (err) {
       throw (err);
      }
      // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
      fs.unlink(tmp_path, function () {
        if (err) throw err;
      });

      fs.readFile(target_path,function(err,data){
        if (err){
          throw ('cannot read '+target_path);
        } else {
          var base64Image = data.toString('base64');
          res.send(base64Image);
        }
      });
    });

  } else {
  // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
    fs.unlink(tmp_path, function (err) {
      if (err) throw err;
    });
    msg = "File upload failed. File extension must be "+extensionAllowed[0]+" or "+extensionAllowed[1]+" and size must be less than " + maxSizeOfFile;
   res.send(msg);
  }
};

exports.igCB = function (req, res) {
  fs.unlink('./vids/instagram.mp4', function () {});
  if (req.user){
    var user = req.user;
    var apiCall = "https://api.instagram.com/v1/users/self/media/recent/?access_token=";
    var token = user.accessToken;
    var media_json,
        media,
        url,
        next_max_id="",
        pages=0;
        urls=[];
    var filters = ['exposure', 'blur' ,'sepia' ,'noise' ,'vignette'];
    var codeText =
"\
 \n\
 //This line of code makes your movie play!\n\
 movie.play();\n\
 //See what happens when you type movie.pause();\n\
\n\
 //The code below lets you add, remove, and alter your video filters.\n\
 //Change the numbers and make your video all your own!\n\
    ";
 function igApiCall(next_page){
  try{
    request.get(apiCall+token+"&max_id="+next_page, function(err, resp, body) {
      if(!err){
        pages++;
        media_json= JSON.parse(body);
        next_page= media_json.pagination.next_max_id;
        media = media_json.data;
        var item;

        for (var i=0; i < media.length; i++){
          item = media[i];
          if (item.hasOwnProperty("videos")) {
            displayMedia = item;
            urls.push(item.videos.standard_resolution.url);                    
          }
        }
        if(urls.length>0){
          url = urls[0];
          var i = url.lastIndexOf('.');
          var file_extension = (i < 0) ? '' : url.substr(i);
          var target_path = './vids/instagram'+file_extension;            
          request(url).pipe(fs.createWriteStream(target_path));
        }      
      } else {
        res.send('error with Instagram API');
        return;
      }
    if(next_page){
      console.log('paginating...');
      igApiCall(next_page);
    } else {
      console.log('paginated all pages: '+pages);
      res.render('demo', {
        code: codeText,
        filters: filters,
        user: user
      });        
    }      
    });
} catch (e){console.log(e)};
}
  igApiCall(next_max_id); 
  }
};

exports.igGet = function(req,res){
  fs.readFile("./vids/instagram.mp4",function(err,file){
        if (err){
          res.send(500);
        } else {
          // res.send(file);
          var base64Image = file.toString('base64');
          res.send(base64Image);
        }
      });
};

function generateToken(crypto) {
  var tokenLength = 10;
  var buf = crypto.randomBytes(Math.ceil(tokenLength * 3 / 4));
  var token = buf.toString('base64').slice(0, tokenLength).replace(/\+/g, '0').replace(/\//g, '0');
  return token;
}

function save(db, token, video, code) {
  var vc = db.get('vidcode');
  vc.findOne({ token: token }, function (err, doc) {
    if (!doc) {
      doc = { token: token };
      if (video) {
        doc.video = video;
      }
      if (code) {
        doc.code = code;
      }

      vc.insert(doc);
    } else {
      if (video) {
        doc.video = video;
      }
      if (code) {
        doc.code = code;
      }

      vc.update(doc);
    }
  });
}

function oc(a) {
  var o = {};
  for (var i = 0; i < a.length; i++) {
    o[a[i]] = '';
  }
  return o;
}

function ensureAuthenticated(user) {
  console.log('authentication = '+ user);
  return next();
};