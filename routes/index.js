var fs = require('fs');

exports.index = function (req, res) {
  res.render('index', { title: 'VidCode' });
};

exports.demo = function (db) {
  return function (req, res) {
    var token = req.params.token;
    var filters = ['exposure', 'blur' ,'filmgrain' ,'noise' ,'vignette'];

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

      res.render('demo', { layout: 'lesson', code: codeText, filters:filters});
      return;
    }

    var vc = db.get('vidcode');
    vc.findOne({ token: token }, function (err, doc) {
      if (!doc) {
        res.status(404);
      }
        res.render('demo', { layout: 'lesson', code: doc.code , filters: filters});
    });
  };
};

exports.demo2 = function (db) {
  return function (req, res) {
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
      res.render('demo2', { layout: 'lesson', code: codeText, filters:filters });
      return;
    }

    var vc = db.get('vidcode');
    vc.findOne({ token: token }, function (err, doc) {
      if (!doc) {
        res.status(404);
      }
        res.render('demo2', { layout:'lesson', code: doc.code });
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
