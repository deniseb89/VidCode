var fs = require('fs');
var stream = fs.createReadStream('./file');

stream.on('data', function(data) {
  postReq.write(data);
});

stream.on('end', function() {
  postReq.end();
});