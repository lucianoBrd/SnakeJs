window.onload = function () {
  var direction = 'down';
  var score = 0;
  var snakeSize = 10;
  var snake;
  var food;
  var ctx;

  var canvasWidth = 700;
  var canvasHeight = 500;
  var canvasDiv = document.getElementById('canvasDiv');
  var btn = document.getElementById("startButton");
  btn.addEventListener("click", function(){
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('id', 'canvas');
    canvasDiv.appendChild(canvas);
    if(typeof G_vmlCanvasManager != 'undefined') {
  	canvas = G_vmlCanvasManager.initElement(canvas);
  }
  ctx = canvas.getContext('2d');
  init();
  });






  var bodySnake = function(x, y) {
    ctx.fillStyle = 'green';
    ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
    ctx.strokeStyle = 'darkgreen';
    ctx.strokeRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
  }

  var pizza = function(x, y) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
    ctx.fillStyle = 'red';
    ctx.fillRect(x*snakeSize+1, y*snakeSize+1, snakeSize-2, snakeSize-2);
  }

  var scoreText = function() {
    var score_text = "Score: " + score;
    ctx.fillStyle = 'blue';
    ctx.fillText(score_text, 145, canvasHeight-5);
  }

  var drawSnake = function() {
    var length = 4;
    snake = [];
    for (var i = length-1; i>=0; i--) {
        snake.push({x:i, y:0});
    }
  }

  var paint = function(){
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight);

    btn.setAttribute('disabled', true);

    var snakeX = snake[0].x;
    var snakeY = snake[0].y;

    if (direction == 'right') {
      snakeX++; }
    else if (direction == 'left') {
      snakeX--; }
    else if (direction == 'up') {
      snakeY--;
    } else if(direction == 'down') {
      snakeY++; }

    if (snakeX == -1 || snakeX == canvasWidth/snakeSize || snakeY == -1 || snakeY == canvasHeight/snakeSize || checkCollision(snakeX, snakeY, snake)) {
      //restart game
      btn.removeAttribute('disabled', true);

      ctx.clearRect(0,0,canvasWidth,canvasHeight);
      gameloop = clearInterval(gameloop);
      score = 0;
      return;
    }

    if(snakeX == food.x && snakeY == food.y) {
      var tail = {x: snakeX, y: snakeY}; //Create a new head instead of moving the tail
      score ++;

      createFood(); //Create new food
    } else {
      var tail = snake.pop(); //pops out the last cell
      tail.x = snakeX;
      tail.y = snakeY;
    }
    //The snake can now eat the food.
    snake.unshift(tail); //puts back the tail as the first cell

    for(var i = 0; i < snake.length; i++) {
      bodySnake(snake[i].x, snake[i].y);
    }

    pizza(food.x, food.y);
    scoreText();
  }

  var createFood = function() {
    food = {
      x: Math.floor((Math.random() * 30) + 1),
      y: Math.floor((Math.random() * 30) + 1)
    }

    for (var i=0; i>snake.length; i++) {
      var snakeX = snake[i].x;
      var snakeY = snake[i].y;

      if (food.x===snakeX && food.y === snakeY || food.y === snakeY && food.x===snakeX) {
        food.x = Math.floor((Math.random() * 30) + 1);
        food.y = Math.floor((Math.random() * 30) + 1);
      }
    }
  }

  var checkCollision = function(x, y, array) {
    for(var i = 0; i < array.length; i++) {
      if(array[i].x === x && array[i].y === y)
      return true;
    }
    return false;
  }

  var init = function(){
    direction = 'down';
    drawSnake();
    createFood();
    gameloop = setInterval(paint, 80);
  }

  document.onkeydown = function(event) {

    keyCode = window.event.keyCode;

    switch(keyCode) {

    case 37:
      if (direction != 'right') {
        direction = 'left';
      }
      break;

    case 39:
      if (direction != 'left') {
        direction = 'right';
      }
      break;

    case 38:
      if (direction != 'down') {
        direction = 'up';
      }
      break;

    case 40:
      if (direction != 'up') {
        direction = 'down';
      }
      break;
    }
  }



};
