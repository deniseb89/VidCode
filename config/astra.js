var fs = require('fs');
var restler = require('restler');
var request = require('request');
var crypto = require('crypto');
var Busboy = require('busboy');

var astraAccount = process.env.ASTRA_ACCOUNT;
var astraSecret = process.env.ASTRA_SECRET;


module.exports = {

  getAstraSecret: function(callback){
        callback(astraSecret)
  },

  createBucket: function( bucketName, callback){
    restler.post('https://api.astra.io/v0/bucket', {
      data   : { "name": bucketName },
      headers : { "Astra-Secret": astraSecret }
    }).on('complete', function(response) {
      callback(response);
    });
  },


  listBuckets: function(callback){
    restler.get('https://api.astra.io/v0/bucket',
                { headers : { "Astra-Secret": astraSecret }}
               ).on('complete', function(response) {
                    callback(response);
                  });
  },


  getBucket: function(bucketName, callback){
    restler.get('https://api.astra.io/v0/bucket/'+bucketName, {
                headers : { "Astra-Secret": astraSecret }
              }).on('complete', function(response) {
                callback(response);
              });
  },


  getBucketObjects:function(bucketName, callback){
    restler.get('https://api.astra.io/v0/bucket/'+bucketName +'/object', {
                headers : { "Astra-Secret": astraSecret }
              }).on('complete', function(response) {
                callback(response);
              });
  },


  getVideo: function(bucketName, videoName, callback){
    restler.get('https://cdn.astra.io/v0/public/bucket/'+bucketName+'/object/'+videoName, {
                headers : { "Astra-Secret": astraSecret }
              }).on('complete', function(response) {
                console.log("Completed");
                console.log(response);
                callback(response);
              });
  },


  getVideoUrl: function(bucketName, videoName, callback){
      var url = 'GET:/v0/public/' + astraAccount + '/' + bucketName + '/' + videoName;
      console.log("HASH START");
      var hash = crypto.createHmac('sha1', astraSecret).update(url).digest('base64');
      console.log(hash);
      hash = hash.replace(/\+/g,'-').replace(/\//g,'_').substring(0, hash.length - 1);
      console.log(hash);
      console.log("HASH END");

      urlSigned = 'http://cdn.astra.io/v0/public/' + astraAccount + '/' + bucketName + '/' + videoName + '?hmac=' + hash;
      console.log(urlSigned);
      callback(urlSigned);

  },

  postVideo: function( filePath, bucketName, videoName, callback){

       var fileStats = fs.statSync(filePath);
       var fileSizeInBytes = fileStats["size"];

       var data = {
         'name': videoName,
         'type':'video',
         'content': 'application/mp4',
         'file': restler.file(filePath, null, fileSizeInBytes, null, "video" )
       };

       restler.post('https://api.astra.io/v0/bucket/'+bucketName+'/object', {
         multipart: true,
         data   : data,
         headers : { "Astra-Secret": astraSecret }
       }).on('complete', function(response) {
         console.log('Upload video to bucket: \n', response);
         callback(response);
       });
  },


};
