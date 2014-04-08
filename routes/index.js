exports.index = function (req, res) {
	res.render('index', { title: 'VidCode' });
};

exports.demo = function (dbconn, db) {
	return function (req, res) {
		var collection = db.get('samples');
		collection.find({}, {}, function (e, docs) {
			res.render('demo', { dbconn: dbconn, samples: docs });
		});
	};
};

exports.upload = function (req, res) {

	//get the file name
	console.log(req.files.length);
	var filename = req.files.file.name;
	var extensionAllowed = [".mp4", ".mov"];
	var maxSizeOfFile = 10000000;
	var msg = "";
	var i = filename.lastIndexOf('.');

	// get the temporary location of the file
	var tmp_path = req.files.file.path;

	// set where the file should actually exists - in this case it is in the "images" directory
	var target_path = __dirname + '/upload/' + req.files.file.name;

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
	res.status(302);
	res.setHeader("Location", "/");
	res.end();
};

function oc(a) {
	var o = {};
	for (var i = 0; i < a.length; i++) {
		o[a[i]] = '';
	}
	return o;
}