var fs = require('fs');
var request = require('request');

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

exports.save = function (db) {
  return function (req, res){
    var user = req.user;
    if (!user){
      res.render('404');
      return;
    }
    var vc = db.get('vidcode');
    vc.findOne({ id: user.id, 'social':user.provider}, function (err, doc) { 
      if (!doc) {
        res.render('404', {layout: false});
      } else {
        res.redirect('/share/'+doc.videos.token);        
      }
    });
  }
}

exports.share = function (db) {
  return function (req, res){
    var token = req.params.token;
    if (!token){
      res.render('share_temp');
      return;
    }
    var vc = db.get('vidcode');
    vc.findOne({ 'videos.token' : token }, function (err, doc) { 
      if (!doc) {
        res.render('share_temp');
        // res.render('404', {layout: false});
      } else {
        res.render('share_temp',{video: doc.videos.filename, token:doc.videos.token});        
      }
    });
  }
}

exports.getUserVid = function (req, res){
  var file = req.query.file;
  var rs = fs.createReadStream(file);
  res.setHeader("content-type", "video/mp4");
  rs.pipe(res);
  rs.on('error', function(err){
    res.end();
  })
  //handle read errors
}
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
      res.redirect('/signin');   
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

exports.upload = function(mongo, db, crypto) {
  return function (req, res) {
    var user = req.user || null;
    var id = user.id || null;
    var social = user.provider || 'vidcode';    
    var Busboy = require('busboy');
    var busboy = new Busboy({ headers: req.headers });
    var extensionAllowed = [".mp4", ".mov",".mpeg",".webm"];
    var maxSizeOfFile = 25000000;
    var target_path;
    var filename;
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      //Todo: stream file straight to gridFS
      token = generateToken(crypto);
      filename = token + '.webm';
      target_folder = './video/' +social[0]+'_'+user.id+'/' 
      target_path = target_folder+ filename;
      //Todo: handle error if file doesnt exist. fs.stat(target_path);
      file.pipe(fs.createWriteStream(target_path));
      saveVideo(db, id, social, target_path, token, function(){
      });
    });

    busboy.on('finish', function() {
      // res.end();
    });
    req.pipe(busboy);
  };
};

exports.igCB = function (db) {
  return function (req, res) {
    fs.mkdir('./img/', function (){
      fs.readdir('./img/', function(err, files){
        if (err) {console.log(err);}
        for (var i=0; i<files.length; i++) {
          fs.unlink('./img/'+files[i]);
        }
      });
    });
    var user = req.user;
    if (user){
      fs.mkdir('./video', function (err){
        dir = './video/i_'+user.id+'/';
        fs.mkdir(dir, function (err) {
          fs.readdir(dir, function(err, files){
            for (var i=0; i<files.length; i++) {
              //only delete instagram imported files
              fs.unlink(dir+files[i]);
            }
          });
        });        
      });

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
          urlsVid=[];
          urlsImg=[];

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
            if (item.hasOwnProperty("videos")&&(urlsVid.length<4)) {
              urlsVid.push(item.videos.standard_resolution.url);
            } else if (item.hasOwnProperty("images")&&(urlsImg.length<4)){
              urlsImg.push(item.images.standard_resolution.url);
            }
          }
        } else {
          res.send('error with Instagram API');
          return;
        }
      if(next_page && (pages<5)){
        igApiCall(next_page);
      } else {

        urls = urlsVid.concat(urlsImg);
        for (var i=0; i<urls.length; i++) {
          url = urls[i];
          var ix = url.lastIndexOf('.');
          var file_extension = (ix < 0) ? '' : url.substr(ix);
          if(file_extension == '.jpg'){
            target_path = './img/'+username + '_'+i+file_extension;
          } else if (file_extension == '.mp4'){
            target_path = dir+username + '_'+i+file_extension;
          }

          //buggy but working
          var ws = fs.createWriteStream(target_path);

          request(url).pipe(ws);
          // error catch
        }

        ws.end('this is the end\n');
        ws.on('close', function() {
          var successcb = function(doc) {
            //send all the video filepaths in the response
            res.redirect ('/intro/'+doc.social+'/'+doc.id);
          };  
          var user = req.user;
          var doc = findOrCreate(db,uid, username,'instagram',successcb);
        });
      }
    });

  }
    igApiCall(next_max_id);
    }
  };
};

exports.igGet = function(req,res) {
  var user = req.user;
  var dir = './video/i_'+user.id+'/';
  var filename = req.params.media + '.mp4';

  fs.readdir(dir, function(err, files){
    if (err) {
      console.log('readdir error: '+err);
    } else {
      if (files.indexOf(filename)>=0) {
        fs.readFile(dir+filename, function(err, data) {
          if (err) {
            res.status(500).end();
          } else {
            var base64Image = data.toString('base64');
            res.send(base64Image);
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
    var user = req.user;
    fs.mkdir('./video', function (err){
      dir = './video/f_'+user.id+'/';
      fs.mkdir(dir, function (err) {
      });        
    });

    var successcb = function(doc) {
      res.redirect ('/intro/'+doc.social+'/'+doc.id);
    };  

    var doc = findOrCreate(db,user.id, user.displayName,'facebook',successcb);
  }
}

exports.signup = function (db, crypto) {
  return function (req, res) {
    var email = req.body.email;

    fs.mkdir('./video', function (err){
      dir = './video/v_'+email+'/';
      fs.mkdir(dir, function (err) {
      });        
    });

    var successcb = function(doc) {
      res.redirect ('/intro/'+doc.social+'/'+doc.id);
    };  
    var user = req.user;
    var doc = findOrCreate(db,email, email,'vidcode',successcb);
  };
};

exports.awsUpload = function(req,res){
  var userVidURL = req.query.userVidURL;
  userVidURL = "blob:"+ userVidURL.substr(5).replace(/:/g,"%3A");
  console.log(userVidURL);
  var AWS = require('aws-sdk');
  AWS.config.loadFromPath('./config.json');
  var s3 = new AWS.S3();
  // request(url).pipe(fs.createWriteStream('./video/aws.webm'));
  request.get(userVidURL, function(err,data){
    if (!err){
      var userVid = data;
      var bucketName = 'vidcode';
      var keyName = 'test.mp4';
      var params = {Bucket: bucketName, Key: keyName, Body: userVid, ACL: 'public-read'};
      s3.putObject(params, function(err, data) {
        if (err)
          console.log('aws error:'+err);
        else
          console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
        });
        } else {
          console.log('request error: '+err);
        }
    });
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

function saveVideo(db, id, social, filename, token, cb) {
  var vc = db.get('vidcode');
  if (id && social){
    vc.findOne({ id: id , social: social}, function (err, doc) {
      if (!doc) {
        doc = { id : id };
        doc.videos = {filename: filename, token: token}
        //also insert title and description
        console.log('created new doc with'+filename);
        vc.insert(doc);
      } else {
        //but dont really just set and replace here. instead, add videos to the videos object
        vc.update(doc, { $set: { videos: {filename: filename, token: token }} });
      }
      cb()
    });    
  } else {
    //no user logged in but we'll still save the video
      doc = { videos: {filename: filename, token: token} };
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