/*
---------------------Plan du code---------------------
--> Déclaration des variables du jeu
--> Gestion des meilleurs scores (mise de côté temporairement)
--> Initialisation de l'environnement de jeu
--> Fonctions d'affichage des éléments
--> Fonctions de calcul des coordonnées et traitements sur les variables
--> Méthode principale (Paint)
--> Modal
--------------------- fin ---------------------
*/

window.onload = function () {

//-------------------------------------------------------------partie déclaration des variables du jeu-------------------------------------------------------------

//déclaration variables d'accès pour les fichier json
  var path = './assets/niv/';
  var pathScore = './assets/scores/score'
  var extension = '.json';
//end

//déclaration variables pour le jeu
  var niv; //choix du niveau
  var direction = 'down'; // direction du joueur
  var score = 0; //score
  var snakeSize = 20; //taille du snake
  var snake; //tab
  var snakeX ;
  var snakeY;
  var food; //tab pour les fruits
  var ctx; //contexte du canvas
  var canvasColorBack = 'black';
  var canvasColorStroke = 'black';
  var wallsColor = 'red';
  var colorBodySnake = 'lightgray';
  var colorSnakeStroke = 'gray';
  var colorSwitcher = "black";
  var switcher = [];
//end

//déclaration variables son
  var music = ['./assets/sound/eat.mp3', './assets/sound/loose.mp3', './assets/sound/game.mp3', './assets/sound/crazie.mp3', './assets/sound/crazie/banzai.mp3', './assets/sound/crazie/bouche.mp3', './assets/sound/crazie/debile.mp3', './assets/sound/crazie/kung_fu.mp3', './assets/sound/crazie/oui.mp3', './assets/sound/crazie/siren.mp3']; //chemins vers différents sons
  var game;


  var sound = function(select){
    var audio = new Audio(music[select]);
    audio.play();
  }
//end

//déclaration variables pour gérer l'affichage du menu
  var left = document.getElementById("left");
  var right = document.getElementById("right");
  var exit = document.getElementById("exit");
  var circle = document.getElementById("circle");
// end declaration

//déclaration variables relatives à un niveau (JSON)
  var niv1;//pour les score du niveau 1
  var niv2; //score du niveau 2
  var niv3; //score du niveau 3
  var niv4; //score du niveau folie
  var niv1N;//pour les nom best score du niveau 1
  var niv2N; //nom best score du niveau 2
  var niv3N; //nom best score du niveau 3
  var niv4N; //nom best score du niveau folie
  var nowNiv;
  var delay;
  var walls = [];
  var person;
  var username;
//end

//déclaration variables images
  var img = new Image();   // Crée un nouvel élément Image
  img.src = 'assets/img/eat.png'; // Définit le chemin vers sa source
  var imgTete = new Image();
  imgTete.src='assets/img/tete.png';
//end


  var canvasWidth = 1920;//propriétés du canvas
  var canvasHeight = 900;

  var canvasDiv = document.getElementById('canvasDiv'); //accès au dom (div du canvas)

//-----------------------------------------------------------------------end partie declaration de variables----------------------------------------------------------------


/*------------------------------------------------------------partie gestion des scores (temporairement délaissée)--------------------------------------------------*/
  loadScore(); //chargement initial des scores

  var checkScore = function(score){ // fonction qui gère si le score courant est un meilleur score
    switch(nowNiv){
      case 1:
        if(score > niv1){
          niv1 = score;
          niv1N = username;
        }
        break;
      case 2:
        if(score > niv2){
          niv2 = score;
          niv2N = username;
        }
        break;
      case 3:
        if(score > niv3){
          niv3 = score;
          niv3N = username;
        }
        break;
      case 4:
        if(score > niv4){
          niv4 = score;
          niv4N = username;
        }
        break;
    }
    fetch('edit.php?1='+niv1+'&2='+niv2+'&3='+niv3+'&4='+niv4+'&1n='+niv1N+'&2n='+niv2N+'&3n='+niv3N+'&4n='+niv4N); // si oui on lance le fichier php qui va modifier le fichier json
    printScore();
  }

  function loadScore(){ //récupère les scores  dans le fichier json
      fetch(pathScore+extension).then(function(response) {
        if (response.ok) {
            return response.json()
        } else {
            throw ("Error " + response.status);
        }
      }).then(function(data) {
        niv1 = data.Niveau1[0];
        niv1N = data.Niveau1[1];
        niv2 = data.Niveau2[0];
        niv2N = data.Niveau2[1];
        niv3 = data.Niveau3[0];
        niv3N = data.Niveau3[1];
        niv4 = data.Niveau4[0];
        niv4N = data.Niveau4[1];
        printScore();

      }).catch(function(err) {});
    }

  //Fonction pour l'affichage des scores
  var printScore = function(){
    var niv1S = document.getElementById("niv1S");
    var niv2S = document.getElementById("niv2S");
    var niv3S = document.getElementById("niv3S");
    var niv4S = document.getElementById("niv4S");

    niv1S.textContent = niv1N + " " + niv1;
    niv2S.textContent = niv2N + " " + niv2;
    niv3S.textContent = niv3N + " " + niv3;
    niv4S.textContent = niv4N + " " + niv4;
  }

//--------------------------------------------------------------------------------------------------------------------------------------------------------end


//--------------------------------------------------------------------Partie début de jeu avec initialisation des features--------------------------------------------

//ajout des listener sur les différents boutons du menu
  document.getElementById("niv1").addEventListener("click", function(){
    start();
    loadNiv(1);
    nowNiv = 1;
  });

  document.getElementById("niv2").addEventListener("click", function(){
    start();
    loadNiv(2);
    nowNiv = 2;
  });

  document.getElementById("niv3").addEventListener("click", function(){
    start();
    loadNiv(3);
    nowNiv = 3;
  });

  document.getElementById("exit").addEventListener("click", function(){
    start();
    loadNiv(4);
    nowNiv = 4;
  });
//end

//fonction qui active le canvas, affiche le plateau de jeu
  var start = function(){
    // Comme alert mais on récupère le nom du joueur
    person = prompt("Pour une meilleure expérience de jeu, mettre le son.\nEntrez votre nom de joueur :", "Nom Prenom");

    if (person == null || person == "") {
      username = "Soldat X";
    } else {
      username = person;
    }
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('id', 'canvas');
    canvasDiv.appendChild(canvas);
    if(typeof G_vmlCanvasManager != 'undefined') {
  	   canvas = G_vmlCanvasManager.initElement(canvas);
    }
    ctx = canvas.getContext('2d');
  }
//end

//fonction qui va récupérer les données d'un niveau
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
        if(nbNiv == 4){
          switcher = niv.switcher;
        }
        init();

    }).catch(function(err) {
    });
  }
//end

//fonction d'initialisation du snake, nourriture, musique et répétition de la fonction paint
  var init = function(){
    game = new Audio(music[2]);
    direction = 'down';
    canvasColorBack = 'black';
    canvasColorStroke = 'black';
    wallsColor = 'red';
    colorBodySnake = 'lightgray';
    colorSnakeStroke = 'gray';
    drawSnake();
    createFood();


    if(nowNiv===4){
      game = new Audio(music[3]);
      acceleration = setInterval(function(){
        delay-=1;
        gameloop = clearInterval(gameloop);
        gameloop = setInterval(paint, delay);
      }, 2000);

      fruitChange = setInterval(function(){
        createFood();
        fruit(food.x, food.y);
      }, 6000)
      gameColors = setInterval(function(){
        var tmpc = getRandomColor();
        var tmps = tmpc;
        while(tmpc == tmps){
          tmps = getRandomColor();
        }
        canvasColorBack = tmpc;
        canvasColorStroke = tmpc;
        wallsColor = 'white';
        colorBodySnake = tmps;
        colorSnakeStroke = tmpc;
      }, 1000);
    }
    game.play();
    gameloop = setInterval(paint, delay);
    game.addEventListener('ended', function() { //fonction de loop de la musique en cours
      this.currentTime = 0;
      this.play();
    }, false);
  }
//end

//--------------------------------------------------------------------------end initialisation--------------------------------------------------------------


//--------------------------------------------------------------------------Fonctions d'affichage----------------------------------------------------------

//fonction qui affiche les murs d'un nivau s'il en a
  var createWalls = function(color){
    for(var i = 0; i<walls.length; i++){
      ctx.fillStyle = color;
      ctx.fillRect(walls[i][0]*snakeSize, walls[i][1]*snakeSize, snakeSize, snakeSize);
    }
    if(nowNiv == 4){
      for(var i = 0; i<switcher.length; i++){
        ctx.fillStyle = colorSwitcher;
        ctx.fillRect(switcher[i][0]*snakeSize, switcher[i][1]*snakeSize, snakeSize, snakeSize);
      }
    }

  }
//end

//fonction qui retourne une couleur aleatoire
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  //end

//fonction qui affiche le corps du serpent
  var bodySnake = function(x, y, color, strokeColor, head) {
    if(head==true){
      ctx.drawImage(imgTete, x*snakeSize, y*snakeSize, snakeSize, snakeSize);
    }else{
      ctx.fillStyle = color;
      ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
      ctx.strokeStyle = strokeColor;
      ctx.strokeRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
    }
    }

//

//fonction qui affiche notre marine nationale
  var fruit = function(x, y) {
    ctx.drawImage(img, x*snakeSize, y*snakeSize, snakeSize, snakeSize);
  }
//end

//fonction qui affiche le score courant
  var scoreText = function() {
    var score_text = "Score: " + score;
    ctx.fillStyle = 'lightgray';
    ctx.font = "30px Arial";
    ctx.fillText(score_text, canvasWidth/2, canvasHeight-5);
  }
//end
//---------------------------------------------------------------------------------end fonctions affichage----------------------------------------------------------------


//---------------------------------------------------------partie calcul des coordonnées et mises a jour des tableaux de données-----------------------------------------------

//fonction qui remplit le tableau du snake (ensuite bodysnake affiche en fct du tableau)
  var drawSnake = function() {
    var length = 4;
    snake = [];
    for (var i = length-1; i>=0; i--) {
        snake.push({x:i, y:0});
    }
  }
//end

//fonction qui génère une position pour marine en vérifiant qu'elle ne va pas la ou elle n'a pas le droit d'aller !
  var createFood = function() {

    food = {
      x: Math.floor((Math.random() * (94)) ), //génération random des positions (x compris entre 0 et 95 [puis multiplié par la taille du snake])
      y: Math.floor((Math.random() * (43)) )  // y compris entre 0 et 44 puis multiplié par la taille du snake
    }

    //boucle pour tester  si marine apparait sur le snake
    for (var i=0; i>snake.length; i++) {
      var snakeX = snake[i].x;
      var snakeY = snake[i].y;

      if (food.x===snakeX && food.y === snakeY || food.y === snakeY && food.x===snakeX) {
        food.x = Math.floor((Math.random() * (94)) );
        food.y = Math.floor((Math.random() * (43)) );
      }
    }
    //end

    //boucle pour tester si marine apparait sur un mur
    for(var i =0; i<walls.length; i++){

      if(walls[i][0]===food.x && walls[i][1]===food.y){
        food.x = Math.floor((Math.random() * (94)) );
        food.y = Math.floor((Math.random() * (43)) );
      }
    }
    //end

  }
//end

//fonction qui vérifie si le serpent est entré en collision avec lui meme et les murs la bordure est directement dans le test dans paint
  var checkCollision = function(x, y, array) {
    for(var i = 0; i < array.length; i++) { //teste avec sa queue
      if(array[i].x === x && array[i].y === y){
        return true;
      }
    }

    for(var i = 0; i< walls.length; i++){ //teste avec les murs
      if(walls[i][0] === x && walls[i][1]=== y){
        return true;
      }
    }
    for(var i = 0; i< switcher.length; i++){ //teste avec les switcher
      if(switcher[i][0] === x && switcher[i][1]=== y){
        changePos(i);
        return false;
      }
    }

    return false;
  }
//end

//fonction qui permet la teleportation du snake
var changePos = function(i){

  if(i==0){
    snakeX=switcher[1][0];
    snakeY=switcher[1][1];
    for(var i =0; i<snake.length; i++){
      snake[i].x = switcher[1][0];
      snake[i].y = switcher[1][1];
    }
  }
  if(i==1){
    snakeX=switcher[0][0];
    snakeY=switcher[0][1];
    for(var i =0; i<snake.length; i++){
      snake[i].x = switcher[0][0];
      snake[i].y = switcher[0][1];
    }
  }

}
//end

//fonction de capture des évènements clics
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
//end

//--------------------------------------------------------------------------end partie coordonnées-----------------------------------------------------------------------

//-----------------------------------------------------------------fonction centrale paint, appelée pour dessiner le plateau----------------------------------------------
 var paint = function(){
  //affichage du canvas
    ctx.fillStyle = canvasColorBack;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = canvasColorStroke;
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
  //end

  //desactivation des éléments persistants sur le canvas (menu)
    left.style.display="none";
    right.style.display="none";
    exit.style.display="none";
    circle.style.display="none";
  //end

  //récuperation position serpent
    snakeX = snake[0].x;
    snakeY = snake[0].y;
  //end

  //gestion direction du serpent (avec methode onkeydown)
    if (direction == 'right') {
      snakeX++; }
    else if (direction == 'left') {
      snakeX--; }
    else if (direction == 'up') {
      snakeY--;
    } else if(direction == 'down') {
      snakeY++; }
  //end

  //si le joueur entre en collision avec soi-meme, un mur ou une bordure
    if (snakeX == -1 || snakeX == canvasWidth/snakeSize || snakeY == -1 || snakeY == canvasHeight/snakeSize || checkCollision(snakeX, snakeY, snake)) {
    //restart game
      sound(1); //activation musique de perte
      ctx.clearRect(0,0,canvasWidth,canvasHeight); //clean du canvas
      gameloop = clearInterval(gameloop); //stop la boucle de jeu

      if(nowNiv===4){
        acceleration = clearInterval(acceleration);
        fruitChange = clearInterval(fruitChange);
        gameColors = clearInterval(gameColors);
      }
      checkScore(score);
      printScore();
      score = 0; //reinitialise le score
      game.pause();//met la musique de fonc en pause
      game.currentTime = 0; //reinitialise la musique de fond
      setTimeout(function(){ //laisse la photo de fin
        canvas.style.display = "none";
      //réactivation menu
        left.style.display="inline-block";
        right.style.display="inline-block";
        exit.style.display="inline-block";
        circle.style.display="inline-block";

      }, 1300);
      return; //sors de la fonction
    }
  //end

  //si le serpent mange marine
    if(snakeX == food.x && snakeY == food.y) {

      if(nowNiv == 4){
        sound(Math.floor(Math.random() * (9 - 4 + 1)) + 4);
      } else {
        sound(0); //lance le bruitage holywoodien
      }
      var tail = {x: snakeX, y: snakeY}; //créer une nouvelle tête à la place de l'ajouter
      score ++; //incrémente le score
      createFood(); //ajoute une nouvelle marine
    } else {
      var tail = snake.pop(); //enleve la case
      tail.x = snakeX; //rechoisit la bonne case pour la tete
      tail.y = snakeY;
    }

    snake.unshift(tail); //remet la tete a la premiere  case

    for(var i = 0; i < snake.length; i++) { // dessine entierement le serpent avec la bonne taille
      if(i===0){
        bodySnake(snake[i].x, snake[i].y, colorBodySnake, colorSnakeStroke, true);
      }else{
        bodySnake(snake[i].x, snake[i].y, colorBodySnake, colorSnakeStroke,false);
      }

    }


    createWalls(wallsColor); //affiche les murs
    fruit(food.x, food.y); // affiche le fruit
    scoreText(); //affiche le score
  }
//------------------------------------------------------------------------------------end paint---------------------------------------------------------------------------------

//-----------------------------------------------------------------modal----------------------------------------------

    // Define our constructor
    this.Modal = function() {

      // Create global element references
      this.closeButton = null;
      this.modal = null;
      this.overlay = null;

      // Determine proper prefix
      this.transitionEnd = transitionSelect();

      // Define option defaults
      var defaults = {
        autoOpen: false,
        className: 'fade-and-drop',
        closeButton: true,
        content: "",
        maxWidth: 600,
        minWidth: 280,
        overlay: true
      }

      // Create options by extending defaults with the passed in arugments
      if (arguments[0] && typeof arguments[0] === "object") {
        this.options = extendDefaults(defaults, arguments[0]);
      }

      if(this.options.autoOpen === true) this.open();

    }

    // Public Methods

    Modal.prototype.close = function() {
      var _ = this;
      this.modal.className = this.modal.className.replace(" scotch-open", "");
      this.overlay.className = this.overlay.className.replace(" scotch-open",
        "");
      this.modal.addEventListener(this.transitionEnd, function() {
        _.modal.parentNode.removeChild(_.modal);
      });
      this.overlay.addEventListener(this.transitionEnd, function() {
        if(_.overlay.parentNode) _.overlay.parentNode.removeChild(_.overlay);
      });
    }

    Modal.prototype.open = function() {
      buildOut.call(this);
      initializeEvents.call(this);
      window.getComputedStyle(this.modal).height;
      this.modal.className = this.modal.className +
        (this.modal.offsetHeight > window.innerHeight ?
          " scotch-open scotch-anchored" : " scotch-open");
      this.overlay.className = this.overlay.className + " scotch-open";
    }

    // Private Methods

    function buildOut() {

      var content, contentHolder, docFrag;

      /*
       * If content is an HTML string, append the HTML string.
       * If content is a domNode, append its content.
       */

      if (typeof this.options.content === "string") {
        content = this.options.content;
      } else {
        content = this.options.content.innerHTML;
      }

      // Create a DocumentFragment to build with
      docFrag = document.createDocumentFragment();

      // Create modal element
      this.modal = document.createElement("div");
      this.modal.className = "scotch-modal " + this.options.className;
      this.modal.style.minWidth = this.options.minWidth + "px";
      this.modal.style.maxWidth = this.options.maxWidth + "px";

      // If closeButton option is true, add a close button
      if (this.options.closeButton === true) {
        this.closeButton = document.createElement("button");
        this.closeButton.className = "scotch-close close-button";
        this.closeButton.innerHTML = "&times;";
        this.modal.appendChild(this.closeButton);
      }

      // If overlay is true, add one
      if (this.options.overlay === true) {
        this.overlay = document.createElement("div");
        this.overlay.className = "scotch-overlay " + this.options.className;
        docFrag.appendChild(this.overlay);
      }

      // Create content area and append to modal
      contentHolder = document.createElement("div");
      contentHolder.className = "scotch-content";
      contentHolder.innerHTML = content;
      this.modal.appendChild(contentHolder);

      // Append modal to DocumentFragment
      docFrag.appendChild(this.modal);

      // Append DocumentFragment to body
      document.body.appendChild(docFrag);

    }

    function extendDefaults(source, properties) {
      var property;
      for (property in properties) {
        if (properties.hasOwnProperty(property)) {
          source[property] = properties[property];
        }
      }
      return source;
    }

    function initializeEvents() {

      if (this.closeButton) {
        this.closeButton.addEventListener('click', this.close.bind(this));
      }

      if (this.overlay) {
        this.overlay.addEventListener('click', this.close.bind(this));
      }

    }

    function transitionSelect() {
      var el = document.createElement("div");
      if (el.style.WebkitTransition) return "webkitTransitionEnd";
      if (el.style.OTransition) return "oTransitionEnd";
      return 'transitionend';
    }


  var myContent = document.getElementById('content');

  var myModal = new Modal({
    content: myContent
  });

  var triggerButton = document.getElementById('trigger');

  triggerButton.addEventListener('click', function() {
    myModal.open();
  });
//------------------------------------------------------------------------------------end modal---------------------------------------------------------------------------------




};
