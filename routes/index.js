var fs = require('fs');
var vid_file = "";

exports.index = function (req, res) {
	res.render('index', { title: 'VidCode' });
};

exports.demo = function (db) {
	return function (req, res) {

		var token = req.params.token;

		if (!token) {
			res.render('demo', { code: "No Code To Show Yet!" });
			return;
		}

		var vc = db.get('vidcode');
		vc.findOne({ token: token }, function (err, doc) {
			if (!doc) {
				res.status(404);
			}

			res.render('demo', { code: doc.code });
		});
	};
};

exports.video = function(req,res){

	if (vid_file == ""){
		res.sendfile('vids/demo.mp4');
	} else {
		res.sendfile('vids/'+vid_file);
	}
}

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
>>>>>>> 6c60b4a9c01de208452bcc1e2f0bce654987a65e

exports.upload = function (req, res, cb) {
	var filename = req.files.file.name;
	var extensionAllowed = [".mp4", ".mov"];
	var maxSizeOfFile = 10000000;
	var msg = "";
	var i = filename.lastIndexOf('.');

	// get the temporary location of the file
	var tmp_path = req.files.file.path;
	var target_path = './vids/' + filename;
	var file_extension = (i < 0) ? '' : filename.substr(i);
	if ((file_extension in oc(extensionAllowed)) && ((req.files.file.size / 1024) < maxSizeOfFile)) {
		fs.rename(tmp_path, target_path, function (err) {
			if (err) throw err;
			// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
			fs.unlink(tmp_path, function () {
				if (err) throw err;
			});
		});
	} else {
		// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
		fs.unlink(tmp_path, function (err) {
			if (err) throw err;
		});
		msg = "File upload failed.File extension not allowed and size must be less than " + maxSizeOfFile;
	}
	// res.status(302);
	// res.setHeader("Location", "/demo");
	vid_file = filename;
	// res.end("null");
	res.end('upload complete');
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