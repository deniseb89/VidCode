//v3
var OAUTH2_CLIENT_ID = '244747820962-nrfhhr6793kio6v2hsfct27g49u2g0dq.apps.googleusercontent.com';
var OAUTH2_SCOPES = [
  'https://www.googleapis.com/auth/youtube'
];
var CHANNELS_SERVICE_URL = 'https://www.googleapis.com/youtube/v3/channels';
var VIDEOS_UPLOAD_SERVICE_URL = 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet';
var VIDEOS_SERVICE_URL = 'https://www.googleapis.com/youtube/v3/videos';
var INITIAL_STATUS_POLLING_INTERVAL_MS = 15 * 1000;
var accessToken;

googleApiClientReady = function() {
  gapi.auth.init(function() {
    window.setTimeout(checkAuth, 1);
  });
}

// Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
// If the currently logged-in Google Account has previously authorized
// the client specified as the OAUTH2_CLIENT_ID, then the authorization
// succeeds with no user intervention. Otherwise, it fails and the
// user interface that prompts for authorization needs to display.
function checkAuth() {
  gapi.auth.authorize({
    client_id: OAUTH2_CLIENT_ID,
    scope: OAUTH2_SCOPES,
    immediate: true
  }, handleAuthResult);
}

// Handle the result of a gapi.auth.authorize() call.
function handleAuthResult(authResult) {
  if (authResult) {
    accessToken = authResult['access_token'];
    // Authorization was successful. Hide authorization prompts and show
    // content that should be visible after authorization succeeds.
    $('#login-button').addClass('hidden');
    $('.pre-auth').hide();
    $('.post-auth').show();
    oauth2Callback();
  } else {
    $('#login-button').removeClass('hidden');    
    $('#login-button').click(function() {
      gapi.auth.authorize({
        client_id: OAUTH2_CLIENT_ID,
        scope: OAUTH2_SCOPES,
        immediate: false
        }, handleAuthResult);
    });
  }
}

// Load the client interfaces for the YouTube Analytics and Data APIs, which
// are required to use the Google APIs JS client. More info is available at
// http://code.google.com/p/google-api-javascript-client/wiki/GettingStarted#Loading_the_Client
function loadAPIClientInterfaces() {
  gapi.client.load('youtube', 'v3', function() {
  });
}

//upload

  function oauth2Callback () {
    if (accessToken) {
      $.ajax({
        url: CHANNELS_SERVICE_URL,
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
        data: {
          part: 'snippet',
          mine: true
        }
      }).done(function(response) {
        $('#channel-name').text(response.items[0].snippet.title);
        // $('#channel-thumbnail').attr('src', response.items[0].snippet.thumbnails.default.url);
        $('.post-sign-in').show();
      });
    }
  };

  function initiateUpload(e) {
    e.preventDefault();

    // file won't be input but rather user's coded video
    // var file = $('#file').get(0).files[0];  

    var file = video_filtered;

    // var file = document.getElementById('myvideo');
    // file.type = $(file).attr('type');
    // file.size = 10000000;
    console.log('file type: '+file.type +' / file size: '+file.size);
    if (file) {
      $('#submit').attr('disabled', true);

      var metadata = {
        snippet: {
          title: $('#vidTitle').val(),
          categoryId: 22
        }
      };

      $.ajax({
        url: VIDEOS_UPLOAD_SERVICE_URL,
        method: 'POST',
        contentType: 'application/json',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'x-upload-content-length': file.size,
          'x-upload-content-type': file.type
        },
        data: JSON.stringify(metadata)
      }).done(function(data, textStatus, jqXHR) {
        resumableUpload({
          url: jqXHR.getResponseHeader('Location'),
          file: file,
          start: 0
        });
      });
    }
  }

  function resumableUpload(options) {
    var ajax = $.ajax({
      url: options.url,
      method: 'PUT',
      contentType: options.file.type,
      headers: {
        'Content-Range': 'bytes ' + options.start + '-' + (options.file.size - 1) + '/' + options.file.size
      },
      xhr: function() {
        // Thanks to http://stackoverflow.com/a/8758614/385997
        var xhr = $.ajaxSettings.xhr();

        if (xhr.upload) {
          xhr.upload.addEventListener(
            'progress',
            function(e) {
              if(e.lengthComputable) {
                var bytesTransferred = e.loaded;
                var totalBytes = e.total;
                var percentage = Math.round(100 * bytesTransferred / totalBytes);

                $('#upload-progress').attr({
                  value: bytesTransferred,
                  max: totalBytes
                });

                $('#percent-transferred').text(percentage);
                $('#bytes-transferred').text(bytesTransferred);
                $('#total-bytes').text(totalBytes);
                $('.during-upload').show();
              }
            },
            false
          );
        }

        return xhr;
      },
      processData: false,
      data: options.file
    });

    ajax.done(function(response) {
      var videoId = response.id;
      $('.post-upload').show();
      checkVideoStatus(videoId, INITIAL_STATUS_POLLING_INTERVAL_MS);
    });

    ajax.fail(function() {
      $('#submit').click(function() {
        alert('Not yet implemented!');
      });
      $('#submit').val('Resume Upload');
      $('#submit').attr('disabled', false);
    });
  }

  function checkVideoStatus(videoId, waitForNextPoll) {
    $.ajax({
      url: VIDEOS_SERVICE_URL,
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
      data: {
        part: 'status,processingDetails,player',
        id: videoId
      }
    }).done(function(response) {
      var processingStatus = response.items[0].processingDetails.processingStatus;
      var uploadStatus = response.items[0].status.uploadStatus;

      $('#post-upload-status').append('<li>Processing status: ' + processingStatus + ', upload status: ' + uploadStatus + '</li>');
      if (processingStatus == 'processing') {
        setTimeout(function() {
          checkVideoStatus(videoId, waitForNextPoll * 2);
        }, waitForNextPoll);
      } else {
        if (uploadStatus == 'processed') {
        $('#post-upload-status').append('<li>Your video has been uploaded. Go to wwww.YouTube.com to see it!</li>');          
          // $('#player').append(response.items[0].player.embedHtml);
        }

      }
    });
  }

  $('#upload-form').submit(initiateUpload);