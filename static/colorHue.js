var animateColors = "
movie.play();

 function colorSwitch() {
  var r = Math.floor(255*Math.random());
  var g = Math.floor(255*Math.random());
  var b = Math.floor(255*Math.random());
  var depth = 0.5;
  effects.fader.amount = depth;
  effects.fader.color = "rgb("+r+","+g+","+b+")";
 }

start = setInterval(colorSwitch, 500);
";