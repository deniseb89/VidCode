var fs = require('fs');
var request = require('request');
var session = require('express-session');

exports.index = function (req, res) {
  res.render('index', {layout:false , title: 'VidCode' });
};

exports.indexGF = function (req, res) {
  res.render('googleForm', {layout:false , title: 'VidCode' });
};

exports.intro = function (db) {
  return function (req, res) {
    var social = req.params.social;
    var id = req.params.id;
    if (id&&social){
      // var social = user.provider;
      // var id = user.id;
      var vc = db.get('vidcode');
      vc.findOne({ id: id, "social":social }, function (err, doc) {
        if (!doc) {
          res.status(404);
        }
          res.render('intro', {user: doc});
          return;
      });      
    } else {
      // There is no logged in user
      res.render('intro');          
    }
  }
};

exports.signin = function (req, res) {
  res.render('signin', { title: 'VidCode' });
};

exports.oldDemo2 = function (req, res) {
  res.render('oldDemo2', { title: 'VidCode' });
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
    var url = req.params.url;
    if (!url){
      res.render('share');
      return;
    }
    var vc = db.get('vidcode');
    vc.findOne({ "share.url" : url }, function (err, doc) {
      if (!doc) {
        res.status(404);
      }
        res.render('share', {video: doc.share.video});
    });
  }
}

exports.save = function (db,crypto) {
   return function (req, res) {
    var user = req.user;
    if (user) {
      var social = user.provider;
      var uid = user.id;
    }

    var video = "/img/wha_color.mp4";    
    //get the webm video. save it to the doc {user.id, user.provider}
    //as share = { video: *.webm, url: token }
    url = generateToken(crypto);
    saveVideo(db, uid, social, url, video);
    res.redirect('/share/' + url);
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
      // vc.findOne({ uid: uid, social:social }, function (err, doc) {
      //   if (!doc) {
      //     res.status(404);
      //   }
      //   console.log('doc: '+doc);
      //     res.render('partone', {code: codeText, filters: filters, user: doc});
      //     return;
      // });
      var successcb = function(doc) {
        res.render("partone", {code: codeText, filters: filters, user: doc});
      };  
      var temp = findOrCreate(db,uid, username,social,successcb);
      
    } else {
      res.render('partone', {code: codeText, filters: filters});          
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

exports.upload = function (req, res) {
  var filename = req.files.file.name;
  var extensionAllowed = [".mp4", ".mov",".MOV"];
  var maxSizeOfFile = 25000000;
  var msg = "";
  var i = filename.lastIndexOf('.');

  // get the temporary location of the file
  var tmp_path = req.files.file.path;
  var target_path = './video/' + filename;
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

exports.igCB = function (db) {
  return function (req, res) {
    fs.mkdir('./video/', function () {
      fs.readdir('./video/', function(err, files){
        for (var i=0; i<files.length; i++) {
          fs.unlink('./video/'+files[i]);
        }
      });
    });

    fs.mkdir('./img/', function (){
      fs.readdir('./img/', function(err, files){
        if (err) {console.log(err);}
        for (var i=0; i<files.length; i++) {
          fs.unlink('./img/'+files[i]);
        }
      });
    });

    if (req.user){
      var user = req.user;
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
            target_path = './video/'+username + '_'+i+file_extension;
          }

          //buggy but working
          var ws = fs.createWriteStream(target_path);
          request(url).pipe(ws);
          // error catch
        }

        ws.end('this is the end\n');
        ws.on('close', function() {
          var successcb = function(doc) {
            // res.render("intro", {user: doc});
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
  var dir = './video/';
  var filename = req.params.media + '.mp4';

  fs.readdir(dir, function(err, files){
    if (err) {
      console.log('readdir error: '+err);
    } else {
      if (files.indexOf(filename)>=0) {
        fs.readFile(dir+filename, function(err, data) {
          if (err) {
            res.send(500);
          } else {
            var base64Image = data.toString('base64');
            res.send(base64Image);
          }          
        });           
      } else {
        console.log(filename+' doesnt exist');
        res.send(500);
      }
    }
  })
};

exports.fbCB = function (db) {
  return function (req, res) {
    var successcb = function(doc) {
      res.redirect ('/intro/'+doc.social+'/'+doc.id);
      // res.render("intro", {user: doc});
    };  
    var user = req.user;
    var doc = findOrCreate(db,user.id, user.displayName,'facebook',successcb);
  }
}

exports.signup = function (db, crypto) {
  return function (req, res) {
    var email = req.body.email;
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
        console.log('new mongo doc for: '+doc.username);
      }
        console.log('found mongo doc for: '+doc.username);
      cb(doc);
    });
}

function saveVideo(db, id, social, url, video) {
  var vc = db.get('vidcode');
  if (id && social){
    vc.findOne({ id: id , social: social}, function (err, doc) {
      if (!doc) {
        doc = { id : id };
        
        if (video) {
          doc.share = {video: video, url: url}
        }
        console.log('created new doc with'+video);
        vc.insert(doc);
      } else {
        vc.update(doc, { $set: { share: {video: video, url: url }} });

        console.log('updated doc with '+video);
      }
    });    
  } else {
    //no user logged in but we'll still save the video
      doc = { share: {video: video, url: url} };
      console.log('created new doc anonymously with' + video);
      vc.insert(doc);
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