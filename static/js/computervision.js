//camera variables
var cameraCanvas,
    cameraContext,
    bufferCanvas,
    bufferContext,
    cameraVideo;

var gUM = navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia ||  navigator.msGetUserMedia;
var URL = window.webkitURL = window.URL || window.webkitURL || window.mozURL || window.msURL;

var computerVision = {
  on : false,
  run: null,
  step: {'x':5, 'y':5},
  size: 4,
  backgroundColor: 'black',

  capture: function(){
        if (gUM) {
            console.log("hey trying to get camera");
            gUM.call(navigator,
                {video:true}, computerVision.start, function(error) {
                alert('couldn\'t get stream, try using Chrome?');
                console.log(error);
            });
        } else {
            console.log('Native device media streaming (getUserMedia) not supported in this browser.');
        }
  },

  start: function(stream){
        clearInterval(computerVision.run);
        
        cameraVideo = document.getElementById('cameraVideo');
        cameraVideo.src = webkitURL.createObjectURL(stream);       

        console.log("got stream");
        computerVision.on = true;
        activateSession();
        effects[allEffects[0]]["bottom"] = seriously.source(camera);
        
        computerVision.updateStream();
        //computerVision.run = setInterval(computerVision.updateStream,60);

  },    
  updateStream: function(){
        //oldFrame = bufferContext.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height).data;
        bufferContext.drawImage(cameraVideo, 0, 0);
        var videoFrame = bufferContext.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height).data;

        cameraContext.clearRect(0,0, cameraCanvas.width, cameraCanvas.height);
        cameraContext.fillStyle = computerVision.backgroundColor;
        cameraContext.fillRect(0,0, cameraCanvas.width, cameraCanvas.height); 

         for(var x=0; x<bufferCanvas.width; x+=computerVision.step.x){
             for(var y=0; y<bufferCanvas.height; y+=computerVision.step.y){
               var i = ((bufferCanvas.width * y) + (bufferCanvas.width-1-x))  * 4;

               cameraContext.fillStyle = "rgba(" + videoFrame[i] + "," + videoFrame[i+1] + "," + videoFrame[i+2] +",1)";
               cameraContext.fillRect(x, y, computerVision.size, computerVision.size);
             }
         }  
        camera.update();
        requestAnimationFrame(computerVision.updateStream);
  }
}