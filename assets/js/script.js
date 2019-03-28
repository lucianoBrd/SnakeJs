window.onload = function () {
  var path = './assets/niv/';
  var pathScore = './assets/scores/score'
  var extension = '.json';
  var niv;
  var direction = 'down';
  var score = 0;
  var snakeSize = 20;
  var snake;
  var food;
  var ctx;
  var music = ['./assets/sound/eat.mp3', './assets/sound/loose.mp3', './assets/sound/game.mp3'];
  var game = new Audio(music[2]);


  var scores = [];
  var delay;
  var walls = [];

  var img = new Image();   // Crée un nouvel élément Image
  img.src = 'assets/img/eat.png'; // Définit le chemin vers sa source

  var canvasWidth = 1920;
  var canvasHeight = 900;
  var canvasDiv = document.getElementById('canvasDiv');
  var mainContainer = document.getElementById("main");
  var modal = document.getElementById("modalbody");
  var btn = document.getElementById("startButton");

  loadScore(); //chargement initial des scores
  for(var i =0; i<scores.length; i++){ //premier remplissage du modal

    txt = document.createTextNode(scores[i][0]+" : "+scores[i][1]);

    modal.appendChild(txt);
    modal.appendChild(document.createElement('hr'));

  }


  btn.addEventListener("click", function(){
   // start();
    //loadNiv(1);

  });

  document.getElementById("niv1").addEventListener("click", function(){
    start();
    loadNiv(1);
  });

  document.getElementById("niv2").addEventListener("click", function(){
    start();
    loadNiv(2);
  });

  document.getElementById("niv3").addEventListener("click", function(){
    start();
    loadNiv(3);
  });

  var sound = function(select){
    var audio = new Audio(music[select]);
    audio.play();
  }

  var start = function(){
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('id', 'canvas');
    canvasDiv.appendChild(canvas);
    if(typeof G_vmlCanvasManager != 'undefined') {
  	   canvas = G_vmlCanvasManager.initElement(canvas);
    }
    ctx = canvas.getContext('2d');
    canvasWidth = canvas.getAttribute("width");
    canvasHeight = canvas.getAttribute("height");
  }

  function loadScore(){
    fetch(pathScore+extension).then(function(response) {
      if (response.ok) {
          return response.json()
      } else {
          throw ("Error " + response.status);
      }
  }).then(function(data) {
      scores = data.score;


  }).catch(function(err) {
  });
  }

  var scoreButton = document.getElementById("scoreButton");

  scoreButton.addEventListener("click", function(){
    loadScore();
    for (let i = 0; i < modal.children.length; i++) {
      remove(modal.children[i]);
    }

    var txt;
    for(var i =0; i<scores.length; i++){

      txt = document.createTextNode(scores[i][0]+" : "+scores[i][1]);

      modal.appendChild(txt);
      modal.appendChild(document.createElement('hr'));


    }



  });

  function loadNiv(nbNiv){
    fetch(path+nbNiv+extension).then(function(response) {
        if (response.ok) {
            return response.json()
        } else {
            throw ("Error " + response.status);
        }
    }).then(function(data) {
        niv = data;
        delay = niv.delay;
        walls = niv.walls;
        init();

    }).catch(function(err) {
    });
  }

  var createWalls = function(){

    for(var i = 0; i<walls.length; i++){
      ctx.fillStyle = 'red';
      ctx.fillRect(walls[i][0]*snakeSize, walls[i][1]*snakeSize, snakeSize, snakeSize);
    }
  }


  var bodySnake = function(x, y) { //
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
    ctx.strokeStyle = 'lightgray';
    ctx.strokeRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
  }

  var fruit = function(x, y) {
    ctx.drawImage(img, x*snakeSize, y*snakeSize, snakeSize, snakeSize);
  }

  var scoreText = function() {
    var score_text = "Score: " + score;
    ctx.fillStyle = 'lightgray';
    ctx.fillText(score_text, canvasWidth/2, canvasHeight-5);
  }

  var drawSnake = function() {
    var length = 4;
    snake = [];
    for (var i = length-1; i>=0; i--) {
        snake.push({x:i, y:0});
    }
  }

  var paint = function(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight);

    btn.setAttribute('disabled', true);
    btn.style.display ="none";

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
      sound(1);
      btn.removeAttribute('disabled', true);
      btn.style.display ="inline-block";
      ctx.clearRect(0,0,canvasWidth,canvasHeight);
      gameloop = clearInterval(gameloop);
      score = 0;
      game.pause();
      game.currentTime = 0;
      setTimeout(function(){

        canvas.style.display = "none";
      }, 500);
      return;
    }

    if(snakeX == food.x && snakeY == food.y) {
      sound(0);
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
    createWalls();
    fruit(food.x, food.y);
    scoreText();
  }

  var createFood = function() {
    food = {
      x: Math.floor((Math.random() * (94)) ),
      y: Math.floor((Math.random() * (43)) )
    }

    for (var i=0; i>snake.length; i++) {
      var snakeX = snake[i].x;
      var snakeY = snake[i].y;

      if (food.x===snakeX && food.y === snakeY || food.y === snakeY && food.x===snakeX) {
        food.x = Math.floor((Math.random() * (94)) );
        food.y = Math.floor((Math.random() * (43)) );
      }
    }

    for(var i =0; i<walls.length; i++){
      if(walls[i][0]===food.x && walls[i][1]===food.y){
        food.x = Math.floor((Math.random() * (94)) );
        food.y = Math.floor((Math.random() * (43)) );
      }
    }
  }

  var checkCollision = function(x, y, array) {
    for(var i = 0; i < array.length; i++) {
      if(array[i].x === x && array[i].y === y){
        return true;
      }
    }
    for(var i = 0; i< walls.length; i++){

      if(walls[i][0] === x && walls[i][1]=== y){

        return true;
      }
    }
    return false;
  }


  var init = function(){
    direction = 'down';
    drawSnake();
    createFood();
    game.play();
    gameloop = setInterval(paint, delay);
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
