var fs = require('fs');

exports.index = function (req, res) {
  res.render('index', { title: 'VidCode' });
};

exports.demo = function (db) {
  return function (req, res) {
    var token = req.params.token;
    var filters = ['exposure', 'blur' ,'filmgrain' ,'noise' ,'vignette'];

    if (!token) {
      res.render('demo', { code: " movie.play();", filters:filters});
      return;
    }

    var vc = db.get('vidcode');
    vc.findOne({ token: token }, function (err, doc) {
      if (!doc) {
        res.status(404);
      }
        res.render('demo', { code: doc.code , filters: filters});
    });
  };
};

exports.demo2 = function (db) {
  return function (req, res) {
    var token = req.params.token;
    var filters = [ 'sepia','fader'];

    if (!token) {
      res.render('demo2', { code: " movie.play();\n\ movie.playbackRate = 1.0;", filters:filters });
      return;
    }

    var vc = db.get('vidcode');
    vc.findOne({ token: token }, function (err, doc) {
      if (!doc) {
        res.status(404);
      }
        res.render('demo2', { code: doc.code });
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
