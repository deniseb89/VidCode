var crypto = require('crypto');
var request = require('request');
var Busboy = require('busboy');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var async = require('async');
var mongoose = require("mongoose");
var Grid = require('gridfs-stream');
var gfs = Grid(mongoose.connection.db, mongoose.mongo);
var User = require('../models/user');
var Vidcode = require('../models/vidcode');
var content = require('../models/content');
var ObjectID = require('mongodb').ObjectID;

module.exports = function (app, passport) {

// =============================================================================
// HOME, PROFILE, GALLERY AND SHARE ROUTES =====================================
// =============================================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        if (req.user) {
            res.redirect('/profile');

        } else {
            res.render('signin', {
                user: req.user, title: 'Vidcode', message: req.flash('message')
            });
        }
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function (req, res) {

        var _units = {};

        mongoose.connection.db.collection('units').find().toArray(function (err, result) {
            if (err) {
                console.log('err in getting units ' + err);
            } else {
                _units = result;

                _units.forEach(function (_unit){

                  _unit.lessons.forEach(function(_lesson){

                    if(req.user.lessons.indexOf(_lesson.lessonId) > -1){
                      _lesson.viewed = true;
                      console.log(_lesson);
                    }

                  });

                });

                if (req.user.vidcodes) {
                    res.render('profile', {
                        user: req.user,
                        videos: req.user.vidcodes,
                        units: _units
                    });
                } else {
                    res.render('profile', {
                        user: req.user,
                        units: _units
                    });
                }
            }
        });
    });

    app.post('/lesson/:lessonId', isLoggedIn, function (req, res) {
        User.findOne({_id: req.user._id}, function (err, user) {
            //take the id and add to units
                if (!err) {
                    user.lessons.addToSet(req.params.lessonId);
                    user.save();

                    var response = {
                        status: 200,
                        success: 'Updated Successfully'
                    };

                    res.end(JSON.stringify(response));
                }
            }
        );
    });

    // ACCOUNT SECTION =========================
    app.get('/account', isLoggedIn, function (req, res) {
        res.render('account', {
            user: req.user
        });
    });

    app.get('/gallery', function (req, res) {
        var userVidURL = req.query.userVidURL;
        if (userVidURL) {
            userVidURL = "blob:" + userVidURL.substr(5).replace(/:/g, "%3A");
        }
        res.render('gallery', {title: 'VidCode Gallery', userVidURL: userVidURL});
    });

    app.get('/galleryshow', function (req, res) {
        res.render('galleryshow', {title: 'Vidcode Gallery'});
    });

    app.get('/share/:token?', function (req, res) {
        var token = req.params.token;
        var file;
        var title;
        var descr;
        if (!token) {
            res.render('share-static', {layout: false});
            return;
        }

        process.nextTick(function () {
            mongoose.connection.db.collection('users').findOne({'vidcodes.token': token}, function (err, user) {
                if (!user) {
                    res.render('404', {layout: false});
                } else {
                    for (var item in user.vidcodes) {
                        if (user.vidcodes[item]['token'] == token) {
                            file = user.vidcodes[item]['file'];
                            title = user.vidcodes[item]['title'];
                            descr = user.vidcodes[item]['descr'];
                        }
                    }

                    res.render('share', {
                        layout: false,
                        user: user,
                        file: file,
                        title: title,
                        descr: descr,
                        url: "http://app.vidcode.io/share/" + token
                    });
                }
            });
        });
    });

// =============================================================================
// AUTHENTICATION ROUTES =======================================================
// =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/signin', function (req, res) {
        res.render('signin', {title: 'Vidcode', message: req.flash('loginMessage')});
    });

    // process the login form
    app.post('/signin', passport.authenticate('local-login', {
        successRedirect: '/intro', // redirect to the secure profile section
        failureRedirect: '/signin', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup', {message: req.flash('signupMessage')});
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/intro', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // facebook ==============================

    // send to facebook to do the authentication
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/cb',
        passport.authenticate('facebook', {
            successRedirect: '/intro',
            failureRedirect: '/'
        }));

    // instagram ==============================

    // send to instagram to do the authentication
    app.get('/auth/instagram', passport.authenticate('instagram'));

    // handle the callback after instagram has authenticated the user
    app.get('/auth/instagram/cb',
        passport.authenticate('instagram', {failureRedirect: '/'}),
        function (req, res) {
            if (req.headers.referer.toString().indexOf('/workstation') > -1) {
                res.redirect('/workstation')
            }
            else {
                res.redirect('/intro');
            }
        });


    // twitter ==============================

    // send to twitter to do the authentication
    app.get('/auth/twitter', passport.authenticate('twitter', {scope: 'email'}));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/cb',
        passport.authenticate('twitter', {
            successRedirect: '/intro',
            failureRedirect: '/'
        }));


    // google ==============================

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    // the callback after google has authenticated the user
    app.get('/auth/google/cb',
        passport.authenticate('google', {
            successRedirect: '/intro',
            failureRedirect: '/'
        }));


    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', {scope: 'email'}));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/cb',
        passport.authorize('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // instagram -------------------------------

    // send to instagram to do the authentication
    app.get('/connect/instagram', passport.authorize('instagram'));

    // handle the callback after facebook has authorized the user
    app.get('/connect/instagram/cb',
        passport.authorize('instagram', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================

    //Not implemented. Is this something we want?

// =============================================================================
// PASSWORD RESET ROUTES =======================================================
// =============================================================================

    app.get('/forgot', function (req, res) {
        res.render('forgot', {
            user: req.user, message: req.flash('message')
        });
    });

    app.post('/forgot', function (req, res, next) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                User.findOne({'vidcode.email': req.body.email}, function (err, user) {
                    if (!user) {
                        req.flash('message', 'No account with that email address exists.');
                        return res.redirect('/forgot');
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function (err) {
                        done(err, token, user);
                    });
                });
            },
            function (token, user, done) {

                var sendgridOptions = {
                    auth: {
                        api_user: process.env.SENDGRID_USERNAME,
                        api_key: process.env.SENDGRID_PASSWORD
                    }
                };

                var mailer = nodemailer.createTransport(sgTransport(sendgridOptions));

                var email = {
                    to: [user.vidcode.email],
                    from: 'no-reply@vidcode.io',
                    subject: 'Vidcode Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };

                mailer.sendMail(email, function (err) {
                    req.flash('message', 'An e-mail has been sent to ' + user.vidcode.email + ' with further instructions.');
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err) return next(err);
            res.redirect('/forgot');
        });
    });

    app.get('/reset', function (req, res) {
        res.render('forgot', {
            user: req.user, message: req.flash('message')
        });
    });

    app.get('/reset/:token', function (req, res) {
        User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {$gt: Date.now()}
        }, function (err, user) {
            if (!user) {
                req.flash('message', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset', {
                user: user, message: req.flash('message')
            });
        });
    });

    app.post('/reset', function (req, res) {

        var password = req.body.password;

        // check password complexity
        if (password != req.body.passwordconfirm) {
            return res.redirect('back', false, req.flash('message', 'Passwords do not match.'));
        }
        if (password.length < 6) {
            return res.redirect('back', false, req.flash('message', 'Password length must be at least 6 characters.'));
        }
        if (!(/[0-9]/).test(password)) {
            return res.redirect('back', false, req.flash('message', 'Password must contain at least one number.'));
        }
        if (!(/[a-z]/).test(password)) {
            return res.redirect('back', false, req.flash('message', 'Password must contain at least one lower case letter.'));
        }
        if (!(/[A-Z]/).test(password)) {
            return res.redirect('back', false, req.flash('message', 'Password must contain at least one upper case letter.'));
        }

        async.waterfall([
            function (done) {
                User.findOne({
                    resetPasswordToken: req.body.token,
                    resetPasswordExpires: {$gt: Date.now()}
                }, function (err, user) {
                    if (!user) {
                        req.flash('message', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }

                    user.vidcode.password = user.generateHash(req.body.password);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function (err) {
                        req.logIn(user, function (err) {
                            done(err, user);
                        });
                    });
                });
            },
            function (user, done) {

                var sendgridOptions = {
                    auth: {
                        api_user: process.env.SENDGRID_USERNAME,
                        api_key: process.env.SENDGRID_PASSWORD
                    }
                };

                var mailer = nodemailer.createTransport(sgTransport(sendgridOptions));

                var email = {
                    to: [user.vidcode.email],
                    from: 'no-reply@vidcode.io',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.vidcode.email + ' has just been changed.\n'
                };

                mailer.sendMail(email, function (err) {
                    req.flash('message', 'Success! Your password has been changed.');
                    done(err);
                });
            }
        ], function (err) {
            res.redirect('/');
        });
    });

// =============================================================================
// GET AND SEND VIDEO ==========================================================
// =============================================================================

    app.get('/instagramVids/', getInstagramVideos, function (req, res) {
        res.send(req.user.instagram.IGvideos);
    });

    app.get('/instagram/:ix', isLoggedIn, function (req, res) {
        var videoURL = req.user.instagram.IGvideos[req.params.ix];
        if (videoURL) {
            request(videoURL).pipe(res);
        } else {
            res.status(500).end();
        }
    });

    app.get('/sample/:file', function (req, res) {
        var file = req.params.file;
        var cdn = 'http://dg786cztanvmc.cloudfront.net';
        request(cdn + '/videos/' + file).pipe(res);
    });

    app.get('/getVideos', isLoggedIn, function (req, res) {
        var user = req.user;
        if (user.vidcodes) {
            res.send(user.vidcodes);
        } else {
            //handle if there are none
            console.log('you have not created any vidcodes');
        }
    });

    app.post('/addVideoToLibrary', isLoggedIn, function (req, res) {

        var video = {};
        var busboy = new Busboy({headers: req.headers});

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

            var ext = mimetype.split('/').pop();
            var token = generateToken(crypto);
            filename = token + ext;
            var ws = gfs.createWriteStream({filename: filename, mode: "w", content_type: mimetype});
            file.pipe(ws);
            ws.on('close', function (file) {
                video.file = file._id;
                video.token = token;
                video.title = "My video added on " + getDateMMDDYYYY();
                video.descr = "My video added on " + getDateMMDDYYYY();

                saveVideoToLibrary(gfs.db, req.user._id, video, function () {
                    res.send(token);
                });
            });
            ws.on('error', function (err) {
                console.log('An error occurred in writing');
                res.end();
            })
        });

        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
            video[fieldname] = val;
        });

        busboy.on('finish', function () {
            console.log('busboy finished');
        });

        req.pipe(busboy);
    });

    app.post('/uploadFinished', isLoggedIn, function (req, res) {
        var video = {};
        var busboy = new Busboy({headers: req.headers});

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

            var token = generateToken(crypto);
            filename = token + '.webm';
            var ws = gfs.createWriteStream({filename: filename, mode: "w", content_type: mimetype});
            file.pipe(ws);
            ws.on('close', function (file) {
                video.file = file._id;
                video.token = token;
                // video.title = "My video created on " + getDateMMDDYYYY();
                // video.descr = "My video created on " + getDateMMDDYYYY();
                // video.code = req.body.code;

                saveVideo(gfs.db, req.user._id, video, function () {
                    res.send(token);
                });
            });
            ws.on('error', function (err) {
                console.log('An error occurred in writing');
                res.end();
            })
        });

        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
            console.log('collected '+fieldname+' with value '+val);
            video[fieldname] = val;
        });

        busboy.on('finish', function () {
            console.log('busboy finished');
        });

        req.pipe(busboy);
    });

    app.post('/video-update-descr', isLoggedIn, function (req, res) {

        var token = req.body.token;
        var title = req.body.title;
        var descr = req.body.descr;
        var code = req.body.code;

        mongoose.connection.db.collection('users').update({
                'vidcodes.token': token
            },
            {$set: {'vidcodes.$.title': title, 'vidcodes.$.descr': descr, 'vidcodes.$.code': code}},
            function (err, result) {
                if (err) {
                    console.log('err in updating vidcode token ' + token + ':' + err);
                } else {

                    console.log('successfully updated vidcode token ' + token);
                }
            });
    });

    app.post('/lesson-update-code', isLoggedIn, function (req, res) {

        var token = req.body.token;
        var code = req.body.code;
        var lessonId = req.body.lessonId;

        mongoose.connection.db.collection('users').update({
                'vidcodes.token': token
            },
            {$set: {'vidcodes.$.code': code}},
            function (err, result) {
                if (err) {
                    console.log('err in updating vidcode token ' + token + ':' + err);
                } else {

                    console.log('successfully updated vidcode token ' + token);
                }
            });
    });

    app.post('/workstation-update-session', isLoggedIn, function (req, res) {

        var token = req.body.token;
        var code = req.body.code;
        var lessonId = req.body.lessonId;
        var videoFileId = req.body.videoFileId;

        var session = {};

        session.code = code;
        session.token = token;
        session.videoFileId = videoFileId;
        session.lessonId = lessonId;

        User.findOne({_id: req.user._id}, function (err, user) {
          if (!err) {
            user.lessons.addToSet(lessonId);
            user.lastSession = session;
            user.inProgressProjects.addToSet(session);
            user.save(
              function (err, result) {
                if (err) {
                  console.log('err in updating Session ' + session + ':' + err);
                } else {

                  console.log('successfully updated vidcode session ' + token);
                }
              });
          }
        });
    });

    app.get('/video', function (req, res) {
        var file = req.query.file;
        var rs = gfs.createReadStream({
            _id: file
        });

        rs.on('error', function (err) {
            console.log('An error occurred in reading file ' + file + ': ' + err);
            res.status(500).end();
        });

        // res.setHeader("content-type", "video/webm");
        rs.pipe(res);
    });

// =============================================================================
// ROUTES TO LESSONS ===========================================================
// =============================================================================

    app.get('/csweek', function (req, res) {
        res.redirect('/intro');
    });

    app.get('/intro', isLoggedIn, function (req, res) {
        res.render('intro', {
            user: req.user
        });
    });

    app.get('/workstation', isLoggedIn, function (req, res) {

      var codeText =
      '\
      movie.play();\n\
      ';

        res.render("workstation",
            {
                user: req.user,
                content: content,
                code: codeText
            });
    });

    app.get('/workstation/:videoFileId?',isLoggedIn, function (req, res) {
        var videoFileId = req.params.videoFileId;
        var file;
        var codeText =
        '\
        movie.play();\n\
        ';

        if (!videoFileId) {
            res.render("workstation",
                {
                    user: req.user,
                    content: content,
                    code: codeText
                });
            return;
        }

        process.nextTick(function () {

                User.findOne({_id: req.user._id}, function (err, user){

                if (!user) {
                    res.render('404', {layout: false});
                } else {
                    var _sessionToLoad = {};

                    if (videoFileId == "lastSession"){

                        // for (var item in user.videoLibrary) {

                        //     if (user.videoLibrary[item]['file'].toString() == user.lastSession.videoFileId) {
                        //         _sessionToLoad.file = user.videoLibrary[item]['file'];
                        //         _sessionToLoad.code = user.videoLibrary[item]['code'];
                        //         _sessionToLoad.video = user.videoLibrary[item];
                        //         _sessionToLoad.videoFileId = user.videoLibrary[item]['videoFileId'];
                        //     }
                        // }

                                _sessionToLoad.file = user.lastSession.videoFileId;
                                _sessionToLoad.code = user.lastSession.code;
                              //  _sessionToLoad.video = user.videoLibrary[item];
                                _sessionToLoad.videoFileId = user.lastSession.videoFileId;
                                
                        user.sessionToLoad = _sessionToLoad;

                        res.render('workstation', {
                            user: user,
                            content: content,
                            code: codeText
                        });

                    }else{
                        for (var item in user.inProgressProjects) {
//1.15.15 update after our call:
//So this is where the I thought the "in progress projects" would be loaded
//though I realize now that instead of loading from the "vidcodes" object as I'm doing here
//we would want to load the In Progress Projects object that you are creating
//The only real difference is the file. The file here is the exported .webm file
//The file we want instead is the raw media file, before any effects have been applied

                            if (user.inProgressProjects[item]['token'] == "dummy-token") {
                            	console.log('found dummy-token');
                                _sessionToLoad.file = user.inProgressProjects[item]['file'];
                                _sessionToLoad.code = user.inProgressProjects[item]['code'];
                                _sessionToLoad.video = user.inProgressProjects[item];
                                _sessionToLoad.videoFileId = user.inProgressProjects[item]['videoFileId'];
                            }
                        }

                        user.sessionToLoad = _sessionToLoad;

                        //handle case that token is not found in the user's records anywhere. Should response with a 404
                        res.render('workstation', {
                            user: user,
                            content: content,
                            code: _sessionToLoad.code,
                            file: _sessionToLoad.file,
                            videoFileId: _sessionToLoad.videoFileId,
                            lastSession: true
                        });
                    }
                }
            });
        });
    });

// =============================================================================
// ROUTE TO PAGE NOT FOUND =====================================================
// =============================================================================

    app.get('*', function (req, res) {
        res.render('404', {layout: false});
    });

};

// =============================================================================
// MIDDLEWARE AND UTILITY FUNCTIONS  ===========================================
// =============================================================================

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

function getInstagramVideos(req, res, next) {

    var user = req.user;
    if (user) {
        var apiCall = "https://api.instagram.com/v1/users/self/media/recent/?access_token=";
        var token = user.instagram.token;
        var media_json,
            media,
            next_max_id = "",
            pages = 0,
            urls = [];

        function igApiCall(next_page) {
            request.get(apiCall + token + "&max_id=" + next_page, function (err, resp, body) {
                if (!err) {
                    pages++;
                    media_json = JSON.parse(body);
                    next_page = media_json.pagination.next_max_id;
                    media = media_json.data;
                    var item;

                    for (var i = 0; i < media.length; i++) {
                        item = media[i];
                        if (item.hasOwnProperty("videos") && (urls.length < 4)) {
                            urls.push(item.videos.standard_resolution.url);
                        }
                    }
                } else {
                    res.send('error with Instagram API');
                    return;
                }
                if (next_page && (pages < 5)) {
                    igApiCall(next_page);
                } else {

                    req.user.instagram.IGvideos = urls;
                    req.user.save();
                    return next();
                }
            });
        }

        igApiCall(next_max_id);
    }
}

function generateToken(crypto) {
    var tokenLength = 10;
    var buf = crypto.randomBytes(Math.ceil(tokenLength * 3 / 4));
    var token = buf.toString('base64').slice(0, tokenLength).replace(/\+/g, '0').replace(/\//g, '0');
    return token;
}

function saveVideo(db, id, video, cb) {
    var vc = db.collection('users');
    if (id) {
        vc.findOne({_id: id}, function (err, doc) {
            if (!doc) {
                console.log("created new doc with video");
                doc = {_id: id};
                doc.videos = {
                    "file": video.file,
                    "title": video.title,
                    "descr": video.descr,
                    "token": video.token,
                    "code": video.code
                };
                vc.insert(doc, function (err, insert) {
                    if (err) {
                        console.log('err in inserting doc ' + id + ':' + err);
                    }
                });
            } else {
                console.log("updated doc with video");
                vc.update(doc, {
                    $addToSet: {
                        vidcodes: {
                            "file": video.file,
                            "title": video.title,
                            "descr": video.descr,
                            "token": video.token,
                            "code": video.code
                        }
                    }
                }, function (err, updated) {
                    if (err) {
                        console.log('err in updating doc ' + id + ':' + err);
                    }
                });
            }
            cb();
        });
    } else {
        doc = {vidcodes: [{"file": video.file, "title": video.title, "descr": video.descr, "token": video.token}]};
        vc.insert(doc, function () {
            console.log('error in inserting anonymous video');
        });
        cb();
    }
}

function saveVideoToLibrary(db, id, video, cb) {
    var vc = db.collection('users');
    if (id) {
        vc.findOne({_id: id}, function (err, doc) {
            if (!doc) {
                console.log("created new doc with video");
                doc = {_id: id};
                doc.videos = {
                    "file": video.file,
                    "title": video.title,
                    "descr": video.descr,
                    "token": video.token
                };
                vc.insert(doc, function (err, insert) {
                    if (err) {
                        console.log('err in inserting doc ' + id + ':' + err);
                    }
                });
            } else {
                console.log("updated doc with video");
                vc.update(doc, {
                    $addToSet: {
                        videoLibrary: {
                            "file": video.file,
                            "title": video.title,
                            "descr": video.descr,
                            "token": video.token
                        }
                    }
                }, function (err, updated) {
                    if (err) {
                        console.log('err in updating doc ' + id + ':' + err);
                    }
                });
            }
            cb();
        });
    } else {
        doc = {vidcodes: [{"file": video.file, "title": video.title, "descr": video.descr, "token": video.token}]};
        vc.insert(doc, function () {
            console.log('error in inserting anonymous video');
        });
        cb();
    }
}

function getDateMMDDYYYY() {
    var date = new Date();

    var m = (date.getMonth() + 1).toString();
    var d = date.getDate().toString();
    var y = date.getFullYear().toString();

    return m + "-" + d + "-" + y;
}
