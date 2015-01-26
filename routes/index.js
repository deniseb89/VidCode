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

exports.trialintro = function (db) {
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
          res.render('intro', {preorder: true, user: doc});
          return;
      });      
    } else {
      // There is no logged in user
      // res.redirect('/signin');
      res.render('intro', {preorder: true});

    }
  }
};

exports.csweek = function (req, res) {
  res.redirect ('/intro');
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
      res.render('share-static', {layout: false});
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
          url:"/share/"+token
        });        
      }
    });
  }
};

exports.getUserVid = function(gfs){
  return function (req, res){

    var file = req.query.file;
    var contentType;

    // gfs.files.find({ _id : file }).toArray(function (err, results) {
    //   console.log(file);
    //   console.log(results[0]);
    //   console.log(contentType);
    // });

    var rs = gfs.createReadStream({
      _id: file
    });    

    rs.on('error', function (err) {
      console.log('An error occurred in reading file '+file+': '+err);
      res.status(500).end();
    });

    // res.setHeader("content-type", "video/webm");
    rs.pipe(res); 
  };
};


exports.workstation = function (db) {
  var content = require('../models/content');  
  return function (req, res) {
    var user = req.user;
    if (user){
      var social = user.provider;
      var vc = db.collection('vidcode');

      var successcb = function(doc) {
        res.render("workstation", {content: content, user: doc});
      };  

      findOrCreate(db,user,successcb);
      
    } else {
      res.render("workstation", {content: content});
    }
  };
};

exports.trial = function (db) {
  var content = require('../models/content');  
  return function (req, res) {
    var user = req.user;
    if (user){
      var social = user.provider;
      var vc = db.collection('vidcode');

      var successcb = function(doc) {
        res.render("workstation", {content: content, preorder: true, user: doc});
      };  

      findOrCreate(db,user,successcb);
      
    } else {
      res.render("workstation", {content: content, preorder: true});
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
};

exports.uploadMedia = function(db, gfs, crypto) {
  return function (req, res) {
    var video = {};
    var user = req.user || null;
    if (!user){
      // console.log('you must be logged in to upload media');
      // return;
    } else {
      var id = user.id;
      var social = user.provider;
    }

    var busboy = new Busboy({ headers: req.headers });
    var filename;

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

      var ws = gfs.createWriteStream({filename: filename, mode:"w", content_type: mimetype});
      file.pipe(ws);
      ws.on('close', function(savefile) {
          console.log(savefile);
          console.log("read user's uploaded media file: "+savefile._id + " with content-type: "+mimetype);
          res.send(savefile._id);    
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
          var referer = req.headers.referer.toString();
          if (referer.indexOf('/workstation') > -1) {
              res.redirect('/workstation')
          }
          else if (referer.indexOf('/trial') > -1) {
              res.redirect('/trial');
          }
          else if (referer.indexOf('/signin') > -1){
              res.redirect('/trialintro');
          }
          else {
              res.redirect('/intro');
          }
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
      var referer = req.headers.referer.toString();
      if (referer.indexOf('/signin') > -1) {
          res.redirect('/trialintro')
      } else {
          res.redirect('/intro');
      }
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
      var referer = req.headers.referer.toString();
      if (referer.indexOf('/signin') > -1) {
          res.redirect('/trialintro')
      } else {
          res.redirect('/intro');
      }
    };  

    user.username = req.body.email;
    user.id = req.body.email;
    user.provider = 'vidcode';
    findOrCreate(db,user,successcb);
  };
};

exports.preOrderSignUp = function(db) {
  return function (req, res) {
    var vc = db.collection('vidcode');
    doc = {
      email : req.body.email,
      social : "preorder"
    }
    vc.insert(doc, {w: 0});
    res.redirect('/trial');
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