//camera variables
var cameraCanvas,
    cameraContext,
    bufferCanvas,
    bufferContext,
    cameraVideo;

var gUM = navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia ||  navigator.msGetUserMedia;
var URL = window.webkitURL = window.URL || window.webkitURL || window.mozURL || window.msURL;

var pixelate = {
  interval: null,	
  stream: null,	
  recordedFrames: [],	
  cameraStatus : false,
  run: null,
  shape: 'square',
  addColor: {'red':0, 'green':0, 'blue':0},	
  step: {'x':5, 'y':5},
  pixelSize: 5,	
  backgroundColor: 'black',

  capture: function(){
        if (gUM) {
            gUM.call(navigator,
                {video:true}, pixelate.start, function(error) {
                alert('You have to allow your camera access!');
                console.log(error);
            });
        } else {
            console.log('Native device media streaming (getUserMedia) not supported in this browser.');
        }
  },

  start: function(str){
	    stream = str;
        clearInterval(pixelate.run);
        
        cameraVideo = document.getElementById('cameraVideo');
        cameraVideo.src = webkitURL.createObjectURL(stream);       

        pixelate.cameraStatus = true;
        effects[allEffects[0]]["bottom"] = seriously.source(camera);
        
        pixelate.interval = setInterval(pixelate.updateStream, 60);

  },    
  updateStream: function(){
        //var oldFrame = bufferContext.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height).data;
        bufferContext.drawImage(cameraVideo, 0, 0, bufferCanvas.width, bufferCanvas.height);
        var videoFrame = bufferContext.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height).data;

        cameraContext.clearRect(0,0, cameraCanvas.width, cameraCanvas.height);
        cameraContext.fillStyle = pixelate.backgroundColor;
        cameraContext.fillRect(0,0, cameraCanvas.width, cameraCanvas.height); 
         for(var x=0; x<bufferCanvas.width; x+=pixelate.step.x){
             for(var y=0; y<bufferCanvas.height; y+=pixelate.step.y){
               var i = ((bufferCanvas.width * y) + (bufferCanvas.width-1-x))  * 4;
				 
			   var color = {'R': videoFrame[i], 'G': videoFrame[i+1], 'B':videoFrame[i+2]} 
			   
			   var finalPixelSize = pixelate.pixelSize;
//			   if(true){
//				  var brightness =  calculateBrightness(color)
//				   finalPixelSize = brightness * pixelate.pixelSize;
//			   }
			   
				 
			   var red =  videoFrame[i]+ pixelate.addColor.red;
			   var green = videoFrame[i+1]+ pixelate.addColor.green;
			   var blue =  videoFrame[i+2]+ pixelate.addColor.blue; 
				 
               cameraContext.fillStyle = "rgba(" + red + "," + green + "," + blue +",1)";
				 
			    if(pixelate.shape == "square"){
					cameraContext.fillRect(x, y, finalPixelSize, finalPixelSize);		
				}	 
				else if( pixelate.shape == "circle"){
				   cameraContext.beginPath();
				   cameraContext.arc(x, y, finalPixelSize/2, 0, 2 * Math.PI, false);
				   cameraContext.fill();
				   cameraContext.closePath();
				}			 
			}
         }  
	  
        camera.update();
  },
   turnOff: function(){
   		clearInterval(pixelate.interval);	   
        pixelate.cameraStatus = false;
		cameraVideo.src = "";
		stream.stop();
 
   }
}


function calculateBrightness(c){	
	 var value = Math.sqrt(
		  c.R * c.R * .241 + 
		  c.G * c.G * .691 + 
		  c.B * c.B * .068
	  );
	value = mapValue(value, 0, 255, 0, 1);
	  return value;
}

function mapValue(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}