var fs = require('fs');
var request = require('request');
var Busboy = require('busboy');

exports.index = function (req, res) {
  res.render('index', {layout:false , title: 'VidCode' });
};

exports.indexGF = function (req, res) {
  res.render('googleForm', {layout:false , title: 'VidCode' });
};

exports.notFound = function(req, res){
  res.render('404', {layout:false , title: 'VidCode' });  
}

exports.intro = function (db) {
  return function (req, res) {
    var social = req.params.social;
    var id = req.params.id;
    if (id&&social){
      var vc = db.get('vidcode');
      vc.findOne({ id: id, 'social':social }, function (err, doc) {
        if (!doc) {
          res.render('404', {layout:false});
          return;
        }
          res.render('intro', {user: doc});
          return;
      });      
    } else {
      // There is no logged in user
      res.redirect('/signin');        
    }
  }
};

exports.signin = function (req, res) {
  res.render('signin', { title: 'VidCode' });
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

exports.share = function (db) {
  return function (req, res){
    var token = req.params.token;
    var file;
    if (!token){
      res.render('404', {layout: false});
      return;
    }

    var vc = db.get('vidcode');    
    vc.findOne({ 'vidcodes.token' : token }, function (err, doc) { 
      if (!doc) {
        res.render('404', {layout: false});
      } else {
        for (var item in doc.vidcodes){
          if(doc.vidcodes[item]['token']==token){
            file = doc.vidcodes[item]['file'];
          }
        };
        res.render('share',{user: doc, file:file});        
      }
    });
  }
}

exports.getUserVid = function(gfs){
  return function (req, res){
    var file = req.query.file;
    var rs = gfs.createReadStream({
      _id: file
    });    

    rs.on('error', function (err) {
      console.log('An error occurred in reading file '+file+': '+err);
      res.status(500).end();
    });
      
    res.setHeader("content-type", "video/webm");
    rs.pipe(res); 
  };
};

exports.partone = function (db) {
   return function (req, res) {
    var filters = ['blur','noise','vignette', 'sepia', 'fader', 'exposure'];
    var codeText =
"\
 \n\
 //This line of code makes your movie play!\n\
 movie.play();\n\
\n\
 //The code below lets you add, remove, and alter your video filters.\n\
 //Change the numbers and make your video all your own!\n\
    ";
    var user = req.user;
    if (user){
      var social = user.provider;
      var uid = user.id;
      var username = user.username;
      var vc = db.get('vidcode');

      var successcb = function(doc) {
        //todo:if instagram user...
        //refresh API call with user.acessToken to get recent videos
        res.render("partone", {code: codeText, filters: filters, user: doc});
      };  
      findOrCreate(db,uid, username,social,successcb);
      
    } else {
        res.render("partone", {code: codeText, filters: filters});
      //res.redirect('/signin');   //when users arent logged in, make them log in
    }
  };
};

exports.parttwo = function (req, res) {
  res.render('parttwo', {title: 'VidCode Lesson' });
};

exports.partthree = function (req, res) {
  res.render('partthree', {title: 'VidCode Lesson' });
};


exports.partfour = function (req, res) {
  res.render('partfour', {title: 'VidCode Lesson' });
};

exports.codeAlone = function (req, res) {
  res.render('codeAlone', {title: 'VidCode Gallery' });
};

exports.filters = function (db) {
  return function (req, res) {
    var user = req.user;
    if (user){
      var username = user.username;
    }
    var token = req.params.token;
    var filters = ['blur','noise','vignette', 'sepia', 'fader', 'exposure'];

    if (!token) {

    var codeText =
"\
 \n\
 //This line of code makes your movie play!\n\
 movie.play();\n\
\n\
 //The code below lets you add, remove, and alter your video filters.\n\
 //Change the numbers and make your video all your own!\n\
    ";

      res.render('filters', {code: codeText, filters: filters, user: username});
      return;
    }

    var vc = db.get('vidcode');
    vc.findOne({ token: token }, function (err, doc) {
      if (!doc) {
        res.status(404);
      }
        res.render('filters', {code: doc.code , filters: filters});
    });
  };
};

exports.scrubbing = function (db) {
  return function (req, res) {
    var user = req.user;
    if (user){
      var username = user.username;
    }    
    var token = req.params.token;

    if (!token) {
      var codeText =
"\
 \n\
 //Remember this?\n\
 movie.play();\n\
\n\
 //playbackRate controls the speed of your video. The \"rate\" tells how fast your frames per second (FPS) are going.\n\
 movie.playbackRate = 1.0;\n\
    ";
      res.render('scrubbing', {code: codeText, user:username});
      return;
    }

    var vc = db.get('vidcode');
    vc.findOne({ token: token }, function (err, doc) {
      if (!doc) {
        res.status(404);
      }
        res.render('scrubbing', {code: doc.code });
    });
  };
};

exports.upload = function(db, gfs, crypto) {
  return function (req, res) {
    var user = req.user || null;
    if (user){
      var id = user.id;
      var social = user.provider;
    } else {
      var id = social = null;
    }

    var busboy = new Busboy({ headers: req.headers });
    var extensionAllowed = [".mp4", ".mov",".mpeg",".webm"];
    var maxSizeOfFile = 25000000;
    var target_path;
    var filename;

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var token = generateToken(crypto);
      filename = token + '.webm';
      var ws = gfs.createWriteStream({filename: filename, mode:"w", content_type: mimetype});
      console.log('created ws');
      file.pipe(ws);
      ws.on('close', function(file) {
        console.log('ws closed');
        saveVideo(db, id, social, file._id, token, function(){
          res.send(token);
        });          
      });
      ws.on('error', function(err){
        console.log('An error occurred in writing');
        res.end();
      })

    });

    busboy.on('finish', function(){
    	console.log('busboy finished');
    })

    req.pipe(busboy);
  };
};

exports.igCB = function (db) {
  return function (req, res) {    
    //use busboy to stream the IG videos
    dir ='./video/';

    var user = req.user;
    if (user){
      var apiCall = "https://api.instagram.com/v1/users/self/media/recent/?access_token=";
      var token = user.accessToken;
      var username = user.username;
      var uid = user.id;
      var media_json,
          media,
          url,
          target_path,
          next_max_id="",
          pages=0;
          urls=[];

   function igApiCall(next_page){
      request.get(apiCall+token+"&max_id="+next_page, function(err, resp, body) {
        if(!err){
          pages++;
          media_json= JSON.parse(body);
          next_page = media_json.pagination.next_max_id;
          media = media_json.data;
          var item;
          var i = 0;

          for (var i=0; i < media.length; i++){
            item = media[i];
            if (item.hasOwnProperty("videos")&&(urls.length<4)) {
              urls.push(item.videos.standard_resolution.url);
            }
          }
        } else {
          res.send('error with Instagram API');
          return;
        }
      if(next_page && (pages<5)){
        igApiCall(next_page);
      } else {

        for (var i=0; i<urls.length; i++) {
          url = urls[i];
          var ix = url.lastIndexOf('.');
          var file_extension = (ix < 0) ? '' : url.substr(ix);
          target_path = dir+username+'_'+i+file_extension;

          //buggy but working
          var ws = fs.createWriteStream(target_path);
          request(url).pipe(fs.createWriteStream(target_path));
          // error catch
        }
  
        ws.end('this is the end\n');
        ws.on('close', function() {
          var successcb = function(doc) {
            //send all the video filepaths in the response
              //console.log('ws closed ');
            res.redirect ('/intro/'+doc.social+'/'+doc.id);
          };  
          var user = req.user;
          var doc = findOrCreate(db,uid,username,'instagram',successcb);
        });
      }
    });

  }
    igApiCall(next_max_id);
    }
  };
};

exports.getSample = function(req,res){
  var file = req.params.file;
  var cdn ='http://d3h2w266vwux2c.cloudfront.net/';
  request(cdn+file).pipe(res);
}

exports.igGet = function(req,res) {
  var user = req.user;
  var dir = './video/';
  var filename = req.params.media +'_' + req.params.ix +'.mp4';

  fs.readdir(dir, function(err, files){
    if (err) {
      console.log('readdir error: '+err);
    } else {
      if (files.indexOf(filename)>=0) {
        fs.readFile(dir+filename, function(err, data) {
          if (err) {
            res.status(500).end();
          } else {
            res.send(data);
          }          
        });           
      } else {
        console.log(filename+' doesnt exist');
        res.status(500).end();
      }
    }
  })
};

exports.fbCB = function (db) {
  return function (req, res) {
    var successcb = function(doc) {
      res.redirect ('/intro/'+doc.social+'/'+doc.id);
    };  

    var user = req.user;
    var doc = findOrCreate(db,user.id, user.displayName,'facebook',successcb);
  }
}

exports.signup = function (db, crypto) {
  return function (req, res) {
    var successcb = function(doc) {
      res.redirect ('/intro/'+doc.social+'/'+doc.id);
    };

    var email = req.body.email;
    var doc = findOrCreate(db,email, email,'vidcode',successcb);
  };
};

function generateToken(crypto) {
  var tokenLength = 10;
  var buf = crypto.randomBytes(Math.ceil(tokenLength * 3 / 4));
  var token = buf.toString('base64').slice(0, tokenLength).replace(/\+/g, '0').replace(/\//g, '0');
  return token;
}

function findOrCreate(db, id, username, social, cb) {
    var vc = db.get('vidcode');
    vc.findOne({ id: id , social: social}, function (err, doc) {
      if (!doc) {
        //insert all the user info we care about
        doc = { id: id };
        if (username) {
          doc.username = username;
        }
        if (social){
          doc.social = social;        
        }
        vc.insert(doc);
      }
      cb(doc);
    });
}

function saveVideo(db, id, social, file, token, cb) {
  var vc = db.get('vidcode');
  if (id && social){
    vc.findOne({ id: id , social: social}, function (err, doc) {
      if (!doc) {
        doc = { id : id };
        doc.videos = {file: file, token: token}
        //also insert title and description
        vc.insert(doc);
      } else {
        vc.update(doc, { $addToSet: { vidcodes: {"file": file, "token": token }}});
      }
      cb()
    });    
  } else {
    //no user logged in but we'll still save the video
      doc = { vidcodes: {"file": file, "token": token} };
      vc.insert(doc);
      cb();
  }
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