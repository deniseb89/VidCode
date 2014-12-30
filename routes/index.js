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

module.exports = function (app, passport) {

// =============================================================================
// HOME, PROFILE, GALLERY AND SHARE ROUTES =====================================
// =============================================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        // res.render('signin', {title: 'Vidcode'});
        res.render('signin', {title: 'Vidcode', message: req.flash('message')});
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function (req, res) {
        if (req.user.vidcodes) {
            res.render('profile', {
                videos: req.user.vidcodes
            });
        } else {
            res.render('profile', {
                user: req.user
            });
        }
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
        var desc;
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
                            desc = user.vidcodes[item]['desc'];
                        }
                    }

                    res.render('share', {
                        layout: false,
                        user: user,
                        file: file,
                        title: title,
                        desc: desc,
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
        passport.authenticate('instagram', {
            successRedirect: '/intro',
            failureRedirect: '/'
        }));


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
                //mongoose.connection.db.collection('users').findOne({'vidcode.email': req.body.email}, function (err, user) {
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
            video[fieldname] = val;
        });

        busboy.on('finish', function () {
            console.log('busboy finished');
        });

        req.pipe(busboy);
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

        res.setHeader("content-type", "video/webm");
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
        res.render("workstation", {content: content, user: req.user});
    });


    app.get('/lesson/cs1', isLoggedIn, function (req, res) {
        var filters = ['blur', 'noise', 'vignette', 'exposure'];
        var advFilters = ['fader'];
        var codeText =
            '\
             movie.play();\n\
                ';
        var user = req.user;
        if (user) {
            //todo:if instagram user...
            //refresh API call with user.acessToken to get recent videos
            res.render("cs1", {code: codeText, filters: filters, advFilters: advFilters, user: req.user});
        }
        else {
            res.render("cs1", {code: codeText, filters: filters, advFilters: advFilters});
        }
    });


    app.get('/lesson/tc2', isLoggedIn, function (req, res) {
        var filters = ['blur', 'noise', 'vignette', 'sepia', 'fader', 'exposure'];
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
        if (user) {

            //todo:if instagram user...
            //refresh API call with user.acessToken to get recent videos
            res.render("lessontwo", {code: codeText, filters: filters, user: req.user});

        } else {
            res.render("lessontwo", {code: codeText, filters: filters});
        }
    });


    app.get('/lesson/tc3', isLoggedIn, function (req, res) {
        var filters = ['blur', 'noise', 'vignette', 'sepia', 'fader', 'exposure'];
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
        if (user) {
            //todo:if instagram user...
            //refresh API call with user.acessToken to get recent videos
            res.render("lessonthree", {code: codeText, filters: filters, user: req.user});

        }
        else {
            res.render("lessonthree", {code: codeText, filters: filters});
        }
    });

    app.get('/lesson/2', isLoggedIn, function (req, res) {
        res.render('parttwo', {
            title: 'VidCode Lesson'
        });
    });

    app.get('/lesson/3', isLoggedIn, function (req, res) {
        res.render('partthree', {
            title: 'VidCode Lesson'
        });
    });

    app.get('/lesson/4', isLoggedIn, function (req, res) {
        res.render('partfour', {
            title: 'VidCode Lesson'
        });
    });

    app.get('/codealone', isLoggedIn, function (req, res) {
        res.render('codeAlone');
    });

    app.get('/filters', isLoggedIn, function (req, res) {
        var user = req.user;
        if (user) {
            var username = user.username;
        }
        var token = req.params.token;
        var filters = ['blur', 'noise', 'vignette', 'sepia', 'fader', 'exposure'];

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

        var vc = mongoose.connection.db.collection('users');
        vc.findOne({token: token}, function (err, doc) {
            if (!doc) {
                res.status(404);
            }
            res.render('filters', {code: doc.code, filters: filters});
        });
    });


    app.get('/scrubbing', isLoggedIn, function (req, res) {
        var user = req.user;
        if (user) {
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
            res.render('scrubbing', {code: codeText, user: username});
            return;
        }

        var vc = mongoose.connection.db.collection('users');
        vc.findOne({token: token}, function (err, doc) {
            if (!doc) {
                res.status(404);
            }
            res.render('scrubbing', {code: doc.code});
        });
    });


// =============================================================================
// ROUTE TO PAGE NOT FOUND =====================================================
// =============================================================================


    app.get('*', function (req, res) {
        res.render('404', {layout: false});
    });

}


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
                doc.videos = {"file": video.file, "title": video.title, "desc": video.desc, "token": video.token};
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
                            "desc": video.desc,
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
        doc = {vidcodes: [{"file": video.file, "title": video.title, "desc": video.desc, "token": video.token}]};
        vc.insert(doc, function () {
            console.log('error in inserting anonymous video');
        });
        cb();
    }
}
