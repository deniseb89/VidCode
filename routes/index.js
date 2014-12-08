var fs = require('fs');
var request = require('request');
var Busboy = require('busboy');
var util = require('util');

exports.notFound = function(req, res){
  res.render('404', {layout:false});  
}

exports.signin = function (req, res) {
  res.render('signin', { title: 'Vidcode' });
};

exports.intro = function (db) {
  return function (req, res) {
    var social = req.params.social;
    var id = req.params.id;
    if (id&&social){
      var vc = db.collection('vidcode');
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
      // res.redirect('/signin');
      res.render('intro');

    }
  }
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
    var title;
    var desc;
    if (!token){
      res.render('404', {layout: false});
      return;
    }

    var vc = db.collection('vidcode');    
    vc.findOne({ 'vidcodes.token' : token }, function (err, doc) { 
      if (!doc) {
        res.render('404', {layout: false});
      } else {
        for (var item in doc.vidcodes){
          if(doc.vidcodes[item]['token']==token){
            file = doc.vidcodes[item]['file'];
            title = doc.vidcodes[item]['title'];
            desc = doc.vidcodes[item]['desc'];
          }
        };
        res.render('share', {
          layout: false,
          user: doc,
          file:file,
          title:title,
          desc:desc,
          url:"http://app.vidcode.io/share/"+token
        });        
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
      var vc = db.collection('vidcode');

      var successcb = function(doc) {
        //todo:if instagram user...
        //refresh API call with user.acessToken to get recent videos
        res.render("partone", {code: codeText, filters: filters, user: doc});
      };  
      findOrCreate(db,user,successcb);
      
    } else {
        res.render("partone", {code: codeText, filters: filters});
      //res.redirect('/signin');   //when users arent logged in, make them log in
    }
  };
};

exports.lessontwo = function (db) {
   return function (req, res) {
    var filters = ['blur','noise','vignette', 'sepia', 'fader', 'exposure'];    
    var codeText =
'\
 \n\
 movie.play();\n\
\n\
 //This code lets you animate the fader filter with a randomizing algorithm!\n\
 function colorSwitch() {\n\
  var r = Math.floor(255*Math.random());\n\
  var g = Math.floor(255*Math.random());\n\
  var b = Math.floor(255*Math.random());\n\
  var depth = 0.5;\n\
  effects.fader.amount = depth;\n\
  effects.fader.color = "rgb("+r+","+g+","+b+")";\n\
 }\n\
 \n\
 //animate = setInterval(colorSwitch, 500);\n\
 \n\
//make it stop by uncommenting the line below\n\
//clearInterval(animate);\n\
\n\
//**Note: In the real version, animation control will be fed by the visual controls, not the editor\n\
\n\
    ';
    var user = req.user;
    if (user){
      var vc = db.collection('vidcode');

      var successcb = function(doc) {
        //todo:if instagram user...
        //refresh API call with user.acessToken to get recent videos
        res.render("lessontwo", {code: codeText, filters: filters, user: doc});
      };  
      findOrCreate(db,user,successcb);
      
    } else {
        res.render("lessontwo", {code: codeText, filters: filters});
    }
  };
};

exports.lessonthree = function (db) {
   return function (req, res) {
    var filters = ['blur','noise','vignette', 'sepia', 'fader', 'exposure'];    
    var codeText =
'\
 movie.play();\n\
\n\
 //This code lets you create stop-motion videos by controlling the frames!\n\
\n\
 clearInterval(stopMotion);\n\
 var i = 0;\n\
 stopMotion = setInterval(function(){\n\
    var still = seriously.source(stills[i]);\n\
    target.source = still;\n\
    i++\n\
    if i(i >= stills.length) { i = 0; }\n\
  }, 250)\n\
\n\
    ';

    var user = req.user;
    if (user){
      var vc = db.collection('vidcode');

      var successcb = function(doc) {
        //todo:if instagram user...
        //refresh API call with user.acessToken to get recent videos
        res.render("lessonthree", {code: codeText, filters: filters, user: doc});
      };  
      findOrCreate(db,user,successcb);
      
    } else {
        res.render("lessonthree", {code: codeText, filters: filters});
    }
  };
};

exports.cs1 = function (db) {
   return function (req, res) {
    var filters = ['blur','noise','vignette', 'fader', 'exposure'];    
    var codeText =
'\
movie.play();\n\
movie.playbackRate = 1;\n\
    ';

    var user = req.user;
    if (user){
      var vc = db.collection('vidcode');

      var successcb = function(doc) {
        //todo:if instagram user...
        //refresh API call with user.acessToken to get recent videos
        res.render("cs1", {code: codeText, filters: filters, user: doc});
      };  
      findOrCreate(db,user,successcb);
      
    } else {
        res.render("cs1", {code: codeText, filters: filters});
    }
  };
};

exports.profilePage = function(db){
  return function(req, res) {
    var user = req.user;
    if (user){
      var social = user.provider;
      var vc = db.collection('vidcode');
      var data;
      
      var successcb = function(doc) {
        res.render('profile', {videos: doc.vidcodes});
      };

      vc.findOne({ id: user.id , social: social}, function(err, doc){
        successcb(doc);
      });
      
    } else {
        res.render('profile');
    }
  }
}

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
  res.render('codeAlone');
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

    var vc = db.collection('vidcode');
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

    var vc = db.collection('vidcode');
    vc.findOne({ token: token }, function (err, doc) {
      if (!doc) {
        res.status(404);
      }
        res.render('scrubbing', {code: doc.code });
    });
  };
};

exports.uploadFinished = function(db, gfs, crypto) {
  return function (req, res) {
    var video = {};
    var user = req.user || null;
    if (user){
      var id = user.id;
      var social = user.provider;
    } else {
      var id = social = null;
    }

    var busboy = new Busboy({ headers: req.headers });
    var filename;

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var token = generateToken(crypto);
      filename = token + '.webm';
      var ws = gfs.createWriteStream({filename: filename, mode:"w", content_type: mimetype});
      file.pipe(ws);
      ws.on('close', function(file) {
        video.file = file._id;
        video.token = token;
        saveVideo(db, id, social, video, function(){
          res.send(token);
        });          
      });
      ws.on('error', function(err){
        console.log('An error occurred in writing');
        res.end();
      })

    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      video[fieldname] = val;
    });

    busboy.on('finish', function(){
    	console.log('busboy finished');
    })

    req.pipe(busboy);
  };
};

exports.igCB = function (db) {
  return function (req, res) {    

    var user = req.user;
    if (user){
      var apiCall = "https://api.instagram.com/v1/users/self/media/recent/?access_token=";
      var token = user.accessToken;
      var username = user.username;
      var uid = user.id;
      var media_json,
          media,
          url,
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
        }
        user.IGvideos = urls;
        
        var successcb = function(doc) {
          res.redirect ('/intro/'+doc.social+'/'+doc.id);
        };

        findOrCreate(db,user,successcb);
      }
    });

  }
    igApiCall(next_max_id);
    }
  };
};

exports.getSample = function(req,res){
  var file = req.params.file;
  var cdn = 'http://dg786cztanvmc.cloudfront.net';
  request(cdn+'/videos/'+file).pipe(res);
}

exports.igVidGet = function(db){
  return function(req,res) {
    var user = req.user;
    console.log('fetching videos for '+user.username);
    var vc = db.collection('vidcode');  
    vc.findOne({ 'id':user.id, 'social':"instagram" }, function (err, doc) {
      if(err){
        console.log('error getting IG videos from Mongo');
      }
      var videoURL = doc.IGvideos[req.params.ix];
      if (videoURL){
        request(videoURL).pipe(res);      
      } else {
        res.status(500).end();
      }
    });
  };
};

exports.igUrlGet = function(db){
  return function(req,res) {
    var user = req.user;
    console.log('fetching video urls for '+user.username);    
    var vc = db.collection('vidcode');
    vc.findOne({ 'id':user.id, 'social':"instagram" }, function (err, doc) {
      if(err){
        console.log('error getting IG video urls from Mongo');
      }
      res.send(doc.IGvideos);
    });    
  }
}

exports.getAllVids = function(db){
  return function (req, res){
    //return vidcodes
    var user = req.user;
    var vc = db.collection('vidcode'); 
    
    vc.findOne({ 'id':user.id, 'social':user.provider}, function (err, doc) { 
      if (!doc) {
        console.log('no doc found');
        //there's no doc for this user
      } else {
        if (doc.vidcodes){
          console.log(doc.vidcodes);
          res.send(doc.vidcodes);
        } else {
        //handle if there are none
        console.log('you have not created any vidcodes');        
        }
      }
    });

  };
};

exports.fbCB = function (db) {
  return function (req, res) {
    var successcb = function(doc) {
      res.redirect ('/intro/'+doc.social+'/'+doc.id);
    };  

    var user = req.user;
    user.username = user.displayName;
    findOrCreate(db,user,successcb);
  }
}

exports.signup = function (db, crypto) {
  return function (req, res) {
    var user = {};
    var successcb = function(doc) {
      res.redirect ('/intro/'+doc.social+'/'+doc.id);
    };
    user.username = req.body.email;
    user.id = req.body.email;
    user.provider = 'vidcode';
    findOrCreate(db,user,successcb);
  };
};

function generateToken(crypto) {
  var tokenLength = 10;
  var buf = crypto.randomBytes(Math.ceil(tokenLength * 3 / 4));
  var token = buf.toString('base64').slice(0, tokenLength).replace(/\+/g, '0').replace(/\//g, '0');
  return token;
}

function findOrCreate(db, user, cb) {

    var vc = db.collection('vidcode');
    vc.findOne({ id: user.id , social: user.provider}, function (err, doc) {
      if (!doc) {
        //insert all the user info we care about
        doc = { id: user.id };
        doc.username = user.username;
        doc.social = user.provider;        
        if (user.IGvideos){
          doc.IGvideos = user.IGvideos;
        }
        // ideally w:1
        vc.insert(doc, {w: 0});  
      }
        if (user.IGvideos){
          vc.update(doc, { $set: { IGvideos: user.IGvideos}}, function(err,updated){
            if (err){
              console.log('err in adding IGvideos '+social+'/'+id+':' + err);            
            }
          });          
        }      
      cb(doc);
    });
}

function saveVideo(db, id, social, video, cb) {
  var vc = db.collection('vidcode');
  if (id && social){
    vc.findOne({ id: id , social: social}, function (err, doc) {
      if (!doc) {
        doc = { id : id };
        doc.videos = {"file": video.file, "title": video.title, "desc": video.desc, "token": video.token};
        vc.insert(doc, function(err,insert){
          if (err){
            console.log('err in inserting doc '+social+'/'+id+':' + err);            
          }          
        });
      } else {
        vc.update(doc, { $addToSet: { vidcodes: {"file": video.file, "title": video.title, "desc": video.desc, "token": video.token}}}, function(err,updated){
          if (err){
            console.log('err in updating doc '+social+'/'+id+':' + err);            
          }
        });
      }
      cb();
    });    
  } else {
      doc = { vidcodes: [{"file": video.file, "title": video.title, "desc": video.desc, "token": video.token}] };
      vc.insert(doc, function(){
        console.log('error in inserting anonymous video');
      });
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