var fs = require('fs');
var stream = fs.createReadStream('./file');

stream.on('data', function(data) {
  postReq.write(data);
});

stream.on('end', function() {
  postReq.end();
});


{
  uploadingFile: {
    size: 11885,
    path: '/tmp/1574bb60b4f7e0211fd9ab48f932f3ab',
    name: 'avatar.png',
    type: 'image/png',
    lastModifiedDate: Sun, 05 Feb 2012 05:31:09 GMT,
    _writeStream: {
      path: '/tmp/1574bb60b4f7e0211fd9ab48f932f3ab',
      fd: 14,
      writable: false,
      flags: 'w',
      encoding: 'binary',
      mode: 438,
      bytesWritten: 11885,
      busy: false,
      _queue: [],
      drainable: true
    },
    length: [Getter],
    filename: [Getter],
    mime: [Getter]
  }
}


fs.readFile(req.files.uploadingFile.path, function (err, data) {
  // ...
  var newPath = __dirname + "/uploads/uploadedFileName";
  fs.writeFile(newPath, data, function (err) {
    res.redirect("back");
  });
});