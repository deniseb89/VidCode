//camera variables
var cameraCanvas,
    cameraContext,
    bufferCanvas,
    bufferContext,
    cameraVideo;

var gUM = navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia ||  navigator.msGetUserMedia;
var URL = window.webkitURL = window.URL || window.webkitURL || window.mozURL || window.msURL;


//audio variables
window.AudioContext = window.AudioContext||window.webkitAudioContext;
var frequencies = null,
    analyser = null,
    volume = 0;

var pixelate = {
  interval: null,	
  stream: null,	
  recordedFrames: [],	
  cameraStatus : false,
  run: null,
  shape: 'circle',
  starPikes: 5,
  addColor: {'red':0, 'green':0, 'blue':0},	
  step: {'x':5, 'y':5},
  pixelSize: 5,	
  backgroundColor: 'black',
  brightnessMode: false,
  audioReactive: false,
  volumeThreshold: 0,
  fill: true,

  capture: function(){
        if (gUM) {
            gUM.call(  navigator,
                      {video:true, audio: true},
                      pixelate.start, 
                      function(error) {
                          alert('You have to allow your camera access!');
                          console.log(error);
                      }
                    );
        } else {
            console.log('Native device media streaming (getUserMedia) not supported in this browser.');
        }
  },

  start: function(str){
	      stream = str;
        clearInterval(pixelate.run);
        
        cameraVideo = document.getElementById('cameraVideo');
        cameraVideo.src = webkitURL.createObjectURL(stream);  
        cameraContext.webkitImageSmoothingEnabled=true;

        pixelate.cameraStatus = true;
        effects[allEffects[0]]["bottom"] = seriously.source(camera);
        
        pixelate.interval = setInterval(pixelate.updateStream, 60);


        //==============audio ==================/
        var audioContext = new AudioContext();       
        var audioSource = audioContext.createMediaStreamSource(stream);

        var gainNode = audioContext.createGain();
        gainNode.gain.value =0;        
        // To simply play it, we can connect it to the "destination" or default output of the context
        audioSource.connect(gainNode); // Connect to the default output
        gainNode.connect(audioContext.destination);

        // FFT
        analyser = (analyser || audioContext.createAnalyser());
        audioSource.connect(analyser);
        frequencies = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencies);

  },    
  updateStream: function(){
        pixelate.soundAnalysis();


        //var oldFrame = bufferContext.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height).data;
        bufferContext.drawImage(cameraVideo, 0, 0, bufferCanvas.width, bufferCanvas.height);
        var videoFrame = bufferContext.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height).data;

        cameraContext.clearRect(0,0, cameraCanvas.width, cameraCanvas.height);
        cameraContext.fillStyle = pixelate.backgroundColor;
        cameraContext.fillRect(0,0, cameraCanvas.width, cameraCanvas.height); 
        
         volume = mapValue(volume, 0, 80, 0, pixelate.pixelSize);

        for(var x=0; x<bufferCanvas.width; x+=pixelate.step.x){
          for(var y=0; y<bufferCanvas.height; y+=pixelate.step.y){
               var i = ((bufferCanvas.width * y) + (bufferCanvas.width-1-x))  * 4;
				 
      			   var color = {'R': videoFrame[i], 'G': videoFrame[i+1], 'B':videoFrame[i+2]} 
      			   
      			   var finalPixelSize = pixelate.pixelSize;

      			   if(pixelate.brightnessMode){
      				  var brightness =  calculateBrightness(color)
                 brigthness = 1-brightness;
      				   finalPixelSize = brightness * pixelate.pixelSize;
      			   }

        
               if(pixelate.audioReactive) {
                  finalPixelSize = volume;
                }
				 
      			   var red =  videoFrame[i]+ pixelate.addColor.red;
      			   var green = videoFrame[i+1]+ pixelate.addColor.green;
      			   var blue =  videoFrame[i+2]+ pixelate.addColor.blue; 
      				 
               cameraContext.fillStyle = "rgba(" + red + "," + green + "," + blue +",1)";
               cameraContext.strokeStyle = "rgba(" + red + "," + green + "," + blue +",1)";
      				 
      			  if(pixelate.shape == "square"){
      					 if(pixelate.fill)  cameraContext.fillRect(x, y, finalPixelSize, finalPixelSize);  
                 else cameraContext.strokeRect(x, y, finalPixelSize, finalPixelSize);  
      				}	 
      				else if( pixelate.shape == "circle"){
      				   cameraContext.beginPath();
      				   cameraContext.arc(x+pixelate.step.x/2, y+pixelate.step.y/2, finalPixelSize/2, 0, 2 * Math.PI, false);
      				   if(pixelate.fill) cameraContext.fill();
                 else  cameraContext.stroke();
      				   cameraContext.closePath();
      				}		
              else if( pixelate.shape == "star"){
                  drawStar(x+pixelate.step.x/2,y+pixelate.step.y/2,pixelate.starPikes,finalPixelSize,finalPixelSize/2);
              }
          } 	 

      }  


      camera.update();


    },
     soundAnalysis: function(){
        analyser.getByteFrequencyData(frequencies);
        
        for (var i = 0; i < frequencies.length; i++)
        {
          volume+=frequencies[i];
        } 
        volume /= frequencies.length;
     }, 
   turnOff: function(){
   		clearInterval(pixelate.interval);	   
        pixelate.cameraStatus = false;

        cameraContext.clearRect(0,0, cameraCanvas.width, cameraCanvas.height);
        cameraContext.fillStyle = 'black';
        cameraContext.fillRect(0,0, cameraCanvas.width, cameraCanvas.height); 
        camera.update();

		    cameraVideo.src = "";
		    stream.stop();
 
   }
}

var createPixelate = function(eff){

  var pixelateExists; 
  var allTM = myCodeMirror.getAllMarks();
  if(eff == "pixel"){
        for (var m = 0; m < allTM.length; m++) {
          var tm = allTM[m];
          if (tm.className == "cm-pixelSize" || tm.className == "cm-pixelateStepX" || tm.className == "cm-pixelateStepY" ) {
             pixelateExists = true;
          }        
      }
     if(!pixelateExists){     
        createCodeInEditor("\n\ ");
        createCodeInEditor("\n\ pixelate.step.x=5;", 'cm-pixelateStepX');
        createCodeInEditor("\n\ pixelate.step.y=5;", 'cm-pixelateStepY');
        createCodeInEditor("\n\ pixelate.pixelSize=4;", 'cm-pixelSize'); 
        $('.cm-pixelateStepX').effect("highlight", 2000);
        $('.cm-pixelateStepY').effect("highlight", 2000);
        $('.cm-pixelSize').effect("highlight", 2000);
      }
  }
  else if(eff == "pixels"){
      for (var m = 0; m < allTM.length; m++) {
          var tm = allTM[m];
          if (tm.className == "cm-colorpixelsR" || tm.className == "cm-colorpixelsG" || tm.className == "cm-colorpixelsB" ) {
             pixelateExists = true;
          }        
      }
     if(!pixelateExists){     
        createCodeInEditor("\n\ ");
        createCodeInEditor("\n\ pixelate.addColor.red=0;", 'cm-colorpixelsR');
        createCodeInEditor("\n\ pixelate.addColor.green=0;", 'cm-colorpixelsG');
        createCodeInEditor("\n\ pixelate.addColor.blue=0;", 'cm-colorpixelsB');
        $('.cm-colorpixelsR').effect("highlight", 2000);
        $('.cm-colorpixelsG').effect("highlight", 2000);
        $('.cm-colorpixelsB').effect("highlight", 2000);
      }
  } 
  else if(eff == "shape"){
      for (var m = 0; m < allTM.length; m++) {
          var tm = allTM[m];
          if (tm.className == "cm-pixelShape" || tm.className == "cm-pixelFill") {
             pixelateExists = true;
          }        
      }
    if(!pixelateExists){     
        createCodeInEditor("\n\ ");
        createCodeInEditor("\n\ pixelate.shape='circle';", 'cm-pixelShape');
        createCodeInEditor("\n\ pixelate.fill=false;", 'cm-pixelFill');
        $('.cm-pixelFill').effect("highlight", 2000);
        $('.cm-pixelShape').effect("highlight", 2000);
      }
  }   
  else if(eff == "background"){
      for (var m = 0; m < allTM.length; m++) {
          var tm = allTM[m];
          if (tm.className == "cm-pixelateBgColor") {
             pixelateExists = true;
          }        
      }
    if(!pixelateExists){     
        createCodeInEditor("\n\ ");
        createCodeInEditor("\n\ pixelate.backgroundColor='black';", 'cm-pixelateBgColor');
        $('.cm-pixelateBgColor').effect("highlight", 2000);
      }
  }
  else if(eff == "audio"){
     for (var m = 0; m < allTM.length; m++) {
          var tm = allTM[m];
          if (tm.className == "cm-pixelateAudioReactive") {
             pixelateExists = true;
          }        
      }
      if(!pixelateExists){     
        createCodeInEditor("\n\ ");
        createCodeInEditor("\n\ pixelate.audioReactive=true;", 'cm-pixelateAudioReactive');
        $('.cm-pixelateAudioReactive').effect("highlight", 2000);
      }
  }
}

var turnOffPixelate = function(eff){
    var allTM = myCodeMirror.getAllMarks();
    for (var m = 0; m < allTM.length; m++) {
        var tm = allTM[m];
        if(eff=="pixel") {
            if(tm.className == "cm-pixelSize"){
                myCodeMirror.removeLine(tm.find().to.line);
            }
            if(tm.className == "cm-pixelateStepX"){
                myCodeMirror.removeLine(tm.find().to.line);
            }        
            if(tm.className == "cm-pixelateStepY"){
                myCodeMirror.removeLine(tm.find().to.line);
            }
        }
        else if(eff=="pixels"){
            if(tm.className == "cm-colorpixelsR"){
                myCodeMirror.removeLine(tm.find().to.line);
                pixelate.addColor.red = 0;
            }        
            if(tm.className == "cm-colorpixelsG"){
                myCodeMirror.removeLine(tm.find().to.line);
                pixelate.addColor.green = 0;
            } 
            if(tm.className == "cm-colorpixelsB"){
                myCodeMirror.removeLine(tm.find().to.line);
                 pixelate.addColor.blue = 0;
           }        
        }
        else if(eff=="shape"){
            if(tm.className == "cm-pixelShape"){
                myCodeMirror.removeLine(tm.find().to.line);
                pixelate.shape='square';
           }            
            if(tm.className == "cm-pixelFill"){
                myCodeMirror.removeLine(tm.find().to.line);
                pixelate.fill=true;
           }         
        }
        else if(eff=="background"){
            if(tm.className == "cm-pixelateBgColor"){
                myCodeMirror.removeLine(tm.find().to.line);
                pixelate.backgroundColor = "black";
            }            
        }
        else if(eff=="audio"){
            if(tm.className == "cm-pixelateAudioReactive"){
                myCodeMirror.removeLine(tm.find().to.line);
                pixelate.audioReactive=true;
           }            
        }
    }
}




 function drawStar(cx,cy,spikes,outerRadius,innerRadius){
      var rot=Math.PI/2*3;
      var x=cx;
      var y=cy;
      var step=Math.PI/spikes;
      cameraContext.beginPath();
      cameraContext.moveTo(cx,cy-outerRadius)
      for(i=0;i<spikes;i++){
        x=cx+Math.cos(rot)*outerRadius;
        y=cy+Math.sin(rot)*outerRadius;
        cameraContext.lineTo(x,y)
        rot+=step

        x=cx+Math.cos(rot)*innerRadius;
        y=cy+Math.sin(rot)*innerRadius;
        cameraContext.lineTo(x,y)
        rot+=step
      }
      cameraContext.lineTo(cx,cy-outerRadius)
      if(pixelate.fill) cameraContext.fill();
      else cameraContext.stroke();
      cameraContext.closePath();
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