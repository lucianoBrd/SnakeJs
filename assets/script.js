window.onload = function () {
  var canvasWidth = 700;
  var canvasHeight = 700;

  var canvasDiv = document.getElementById('canvasDiv');
  canvas = document.createElement('canvas');
  canvas.setAttribute('width', canvasWidth);
  canvas.setAttribute('height', canvasHeight);
  canvas.setAttribute('id', 'canvas');
  canvasDiv.appendChild(canvas);
  if(typeof G_vmlCanvasManager != 'undefined') {
  	canvas = G_vmlCanvasManager.initElement(canvas);
  }

};
