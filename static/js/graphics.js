
/*begin graphics section*/

//canvas variables
var supportCanvas,
    graphicsCanvas,
    graphicsContext;

//graphic variables
var position = {'x':0, 'y':0};
    targetPosition = {'x':0, 'y':0};
    currentPosition = {'x':0, 'y':0};
    speed = {'x':1, 'y':1}
    animationMode = false;
    bouncingAnimation = true;
    size = 200,
    hasGraphic = false;

var animationInterval = setInterval(animateImage, 60);
clearInterval(animationInterval);

//drawing variables
var drawingMode = false;
var hasDrawing = false;
var prevX ;
var prevY ;
var drawingOffset = {'x':0, 'y':0}
var drawingColor = 'green';
//array to store drawing positions
var drawXY = [];


var drawGraphics = function(evt){
    var x, y, rect;
    var img = document.getElementsByClassName('js-selected-graphic')[0];        
    if(evt.which == 1){
        rect = canvas.getBoundingClientRect();
            x = evt.clientX - rect.left;
            y = evt.clientY - rect.top;  

        if(drawingMode){
            graphicsContext.beginPath();
            graphicsContext.moveTo(prevX, prevY);
            graphicsContext.lineTo(x, y);
            graphicsContext.strokeStyle=drawingColor;
            graphicsContext.stroke();                      
   
            graphic.update();
            
            prevX = x;
            prevY = y;

            if(typeof x !== 'undefined'){
                hasDrawing = true;
                drawXY.push({'x': x, 'y':y});
            }
        }

        else if(hasGraphic){       
            if(x < position.x + size && x > position.x && y > position.y && y < position.y + size){
                x = x -img.width/2;
                y = y -img.height/2;
                
                graphicsContext.clearRect(0, 0, graphicsCanvas.width, graphicsCanvas.height);

                if(hasDrawing) reDrawing();

                graphicsContext.drawImage(img,position.x , position.y, size,size-size/5);
                position.x = x;
                position.y = y;  
                graphic.update();
                updateGraphicsEditor();
            }
        }
    }
}


var reDrawGraphic = function(){
    var img = document.getElementsByClassName('js-selected-graphic')[0];
    graphicsContext.clearRect(0, 0, graphicsCanvas.width, graphicsCanvas.height);   
    graphicsContext.drawImage(img, position.x, position.y, size, size-size/5);  
}


var reDrawing = function(){
    graphicsContext.beginPath();
    graphicsContext.moveTo(drawXY[0].x+drawingOffset.x, drawXY[0].y+drawingOffset.y);

    drawXY.forEach(function(element){
        graphicsContext.lineTo(element.x+drawingOffset.x, element.y +drawingOffset.y);      
    });
    graphicsContext.strokeStyle=drawingColor;
    graphicsContext.stroke();
    
}


var animateImage = function(){
    //console.log(currentPosition);

    var img = document.getElementsByClassName('js-selected-graphic')[0];    
    var directionX, directionY;

    if(position.x < targetPosition.x) directionX = true;
    else directionX = false;

    if(position.y < targetPosition.y) directionY = true;
    else directionY = false;


    if(directionX && directionY){
        if(currentPosition.x <= targetPosition.x) currentPosition.x += speed.x;
        if(currentPosition.y <= targetPosition.y) currentPosition.y += speed.y;

        if(currentPosition.x > targetPosition.x && currentPosition.y > targetPosition.y) reverseAnimation();
    }
    else if(directionX && !directionY){
        if(currentPosition.x <= targetPosition.x) currentPosition.x += speed.x;
        if(currentPosition.y >= targetPosition.y) currentPosition.y -= speed.y;


        if(currentPosition.x > targetPosition.x && currentPosition.y < targetPosition.y) reverseAnimation();
    }
    else if(!directionX && directionY){
        if(currentPosition.x >= targetPosition.x) currentPosition.x -= speed.x;
        if(currentPosition.y <= targetPosition.y) currentPosition.y += speed.y;


        if(currentPosition.x < targetPosition.x && currentPosition.y > targetPosition.y) reverseAnimation();
    }
    else if(!directionX && !directionY){
        if(currentPosition.x >= targetPosition.x) currentPosition.x -= speed.x;
        if(currentPosition.y >= targetPosition.y) currentPosition.y -= speed.y;


        if(currentPosition.x < targetPosition.x && currentPosition.y < targetPosition.y) reverseAnimation();
    }    

 
    graphicsContext.clearRect(0, 0, graphicsCanvas.width, graphicsCanvas.height);
    if (hasDrawing) reDrawing(); 

    graphicsContext.drawImage(img,currentPosition.x , currentPosition.y, size,size-size/5);
    graphic.update();

   
}


var reverseAnimation = function(){
    if(bouncingAnimation){
        var temp = {};
        temp.x = targetPosition.x;
        temp.y = targetPosition.y;

        targetPosition.x = position.x;
        targetPosition.y = position.y;

        position.x = temp.x;
        position.y = temp.y;  
        updateGraphicsEditor();  
    }
    else{
        currentPosition.x = position.x;
        currentPosition.y = position.y;
    }    
}


var updateGraphicsCanvas = function(){
    if(!animationMode){
        graphicsContext.clearRect(0, 0, graphicsCanvas.width, graphicsCanvas.height);           
        if(hasGraphic) reDrawGraphic();
        if (hasDrawing) reDrawing(); 

        graphic.update();
    }
}


var updateGraphicsEditor = function(){
    var allTM = myCodeMirror.getAllMarks();
        for (var m = 0; m < allTM.length; m++) {
            var tm = allTM[m];
            if (tm.className=="cm-positionX"){
                var cmLine = tm.find();
                if(hasGraphic) updateCodeInEditor(" position.x="+Math.round(position.x)+";", cmLine.to.line, "cm-positionX" );       
                else myCodeMirror.removeLine(cmLine.to.line);
            }
            if (tm.className=="cm-positionY"){
                var cmLine = tm.find();
                if(hasGraphic) updateCodeInEditor(" position.y="+Math.round(position.y)+";", cmLine.to.line, "cm-positionY" );       
                else myCodeMirror.removeLine(cmLine.to.line);
            }
            if (tm.className=="cm-size"){
                var cmLine = tm.find();
                if(hasGraphic) updateCodeInEditor(" size="+Math.round(size)+";", cmLine.to.line, "cm-size" );       
                else myCodeMirror.removeLine(cmLine.to.line);
            }
            if (tm.className=="cm-animationX"){
                var cmLine = tm.find();
                if(hasGraphic) updateCodeInEditor(" targetPosition.x="+Math.round(targetPosition.x)+";", cmLine.to.line, "cm-animationX" );       
                else myCodeMirror.removeLine(cmLine.to.line);
            }
            if (tm.className=="cm-animationY"){
                var cmLine = tm.find();
                if(hasGraphic) updateCodeInEditor(" targetPosition.y="+Math.round(targetPosition.y)+";", cmLine.to.line, "cm-animationY" );       
                else myCodeMirror.removeLine(cmLine.to.line);
            }
        }
    myCodeMirror.save();
}


var createDrawing = function(){
     drawingMode = true;
       $('#supportCanvas').removeClass('is-hidden');
        createCodeInEditor("\n\ ");
        createCodeInEditor("\n\ drawingMode=true;", 'cm-drawingMode');
        createCodeInEditor("\n\ drawingColor='green';", 'cm-drawingColor');
        createCodeInEditor("\n\ drawingOffset.x=0", 'cm-offsetX');
        createCodeInEditor("\n\ drawingOffset.y=0", 'cm-offsetY'); 
}

var createGraphics = function(){
    hasGraphic = true;
    $('#supportCanvas').removeClass('is-hidden');

    var positionExists = false;
    var sizeExists = false;
    var allTM = myCodeMirror.getAllMarks();

    for (var m = 0; m < allTM.length; m++) {
            var tm = allTM[m];
            if (tm.className == "cm-positionX" || tm.className == "cm-positionY") {
               positionExists = true;
            }
            if (tm.className == "cm-size") {
               sizeExists = true;
            }           
        }

    if(!positionExists){
        var text = "\n\ position.x="+Math.round(position.x)+";";
        createCodeInEditor(text, "cm-positionX");    
        text = "\n\ position.y="+Math.round(position.y)+";";
        createCodeInEditor(text, "cm-positionY");
    }

    if(!sizeExists){
      var text = "\n\ size="+Math.round(size)+";";
      createCodeInEditor(text, "cm-size");
   }    

    if(drawingMode){
        var allTM = myCodeMirror.getAllMarks();
        for (var m = 0; m < allTM.length; m++) {
            var tm = allTM[m];
            if (tm.className=="cm-drawingMode"){
                var cmLine = tm.find();
                updateCodeInEditor(" drawingMode=false;", cmLine.to.line, "cm-drawingMode" );       
            }
        }
    }

}



var createAnimation = function(){
    animationMode = true;
    targetPosition = {'x': 210, 'y': 125 };
    clearInterval(animationInterval);
    animationInterval = setInterval(animateImage, 60);                       
    createCodeInEditor("\n\ ");
    createCodeInEditor("\n\ animationMode=true;", 'cm-animationMode');
    createCodeInEditor("\n\ bouncingAnimation=true;", 'cm-animationBounce');
    createCodeInEditor("\n\ targetPosition.x="+targetPosition.x+";", 'cm-animationX');
    createCodeInEditor("\n\ targetPosition.y="+targetPosition.y+";", 'cm-animationY');
    createCodeInEditor("\n\ speed.x="+speed.x+";", 'cm-animationSpeedX');
    createCodeInEditor("\n\ speed.y="+speed.y+";", 'cm-animationSpeedY');
}

var turnOffGraphics = function(){
    $('.js-graph-click').removeClass('js-selected-graphic'); 
    hasGraphic = false;

    var allTM = myCodeMirror.getAllMarks();
    for (var m = 0; m < allTM.length; m++) {
        var tm = allTM[m];
        if(tm.className == "cm-positionX"){
            myCodeMirror.removeLine(tm.find().to.line);
        }
        if(tm.className == "cm-positionY"){
            myCodeMirror.removeLine(tm.find().to.line);
        }        
        if(tm.className == "cm-size"){
            myCodeMirror.removeLine(tm.find().to.line);
        }
    }

}

var turnOffDrawing = function(){
    drawingMode = false;
    hasDrawing = false;
    drawXY = [];

    var allTM = myCodeMirror.getAllMarks();
    for (var m = 0; m < allTM.length; m++) {
        var tm = allTM[m];
        if(tm.className == "cm-drawingMode"){
            myCodeMirror.removeLine(tm.find().to.line);
        }
        if(tm.className == "cm-drawingColor"){
            myCodeMirror.removeLine(tm.find().to.line);
        }        
        if(tm.className == "cm-offsetX"){
            myCodeMirror.removeLine(tm.find().to.line);
        } 
        if(tm.className == "cm-offsetY"){
            myCodeMirror.removeLine(tm.find().to.line);
        }          
    }
}

var turnOffAnimation = function(status){
    animationMode = false;  
    clearInterval(animationInterval);

    if(status == "delete"){
        var allTM = myCodeMirror.getAllMarks();
        for (var m = 0; m < allTM.length; m++) {
            var tm = allTM[m];
            if(tm.className == "cm-animationMode"){
                  myCodeMirror.removeLine(tm.find().to.line);             
            }
             if(tm.className == "cm-animationX"){
                  myCodeMirror.removeLine(tm.find().to.line);             
            }           
             if(tm.className == "cm-animationY"){
                  myCodeMirror.removeLine(tm.find().to.line);             
            }           
              if(tm.className == "cm-animationSpeedX"){
                  myCodeMirror.removeLine(tm.find().to.line);             
            }           
             if(tm.className == "cm-animationSpeedY"){
                  myCodeMirror.removeLine(tm.find().to.line);             
            }
             if(tm.className == "cm-animationBounce"){
                  myCodeMirror.removeLine(tm.find().to.line);             
            }         
        }  
    }
}

var adjustCanvasHeight = function(){
        var newHeight = $('.video2').height();
        var newWidth = $('.video2').width();

        var marginTop = newHeight*-1;
        marginTop = marginTop-20;

        document.getElementById('video-wrapper').style.height = newHeight+"px";
        document.getElementById('supportCanvas').style.height = newHeight+"px";
        document.getElementById('supportCanvas').style.width = newWidth+"px";
        document.getElementById('graphicsCanvas').style.width = newWidth+"px";
        document.getElementById('graphicsCanvas').style.height = newHeight+"px";
        document.getElementById('supportCanvas').style.marginTop = marginTop+"px";

        graphicsCanvas.width = newWidth;
        graphicsCanvas.height = newHeight;

}