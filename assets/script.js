window.onload = function () {
  var canvasWidth = 700;
  var canvasHeight = 500;
  var canvasDiv = document.getElementById('canvasDiv');
  document.getElementById("startButton").addEventListener("click", function(){
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('id', 'canvas');
    canvasDiv.appendChild(canvas);
    if(typeof G_vmlCanvasManager != 'undefined') {
  	canvas = G_vmlCanvasManager.initElement(canvas);
  }
  });
  
  

};
