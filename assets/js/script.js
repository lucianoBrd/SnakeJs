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
  var food; //tab pour les fruits
  var ctx; //contexte du canvas
//end

//déclaration variables son
  var music = ['./assets/sound/eat.mp3', './assets/sound/loose.mp3', './assets/sound/game.mp3']; //chemins vers différents sons
  var game = new Audio(music[2]);
  game.addEventListener('ended', function() { //fonction de loop de la musique en cours
    this.currentTime = 0;
    this.play();
  }, false);

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
  var niv1;
  var niv2;
  var niv3;
  var nowNiv;
  var delay;
  var walls = [];
//end

//déclaration variables images
  var img = new Image();   // Crée un nouvel élément Image
  img.src = 'assets/img/eat.png'; // Définit le chemin vers sa source
//end


  var canvasWidth = 1920;//propriétés du canvas
  var canvasHeight = 900;

  var canvasDiv = document.getElementById('canvasDiv'); //accès au dom (div du canvas)

//-----------------------------------------------------------------------end partie declaration de variables----------------------------------------------------------------


/*------------------------------------------------------------partie gestion des scores (temporairement délaissée)--------------------------------------------------*/
  loadScore(); //chargement initial des scores

  var checkScore = function(score){
    loadScore();
    switch(nowNiv){
      case 1:
        if(score > niv1){
          niv1 = score;
        }
        break;
      case 2:
        if(score > niv2){
          niv2 = score;
        }
        break;
      case 3:
        if(score > niv3){
          niv3 = score;
        }
        break;
    }
    fetch('edit.php?1='+niv1+'&2='+niv2+'&3='+niv3);
    printScore();
  }

  function loadScore(){
      fetch(pathScore+extension).then(function(response) {
        if (response.ok) {
            return response.json()
        } else {
            throw ("Error " + response.status);
        }
      }).then(function(data) {
        niv1 = data.Niveau1;
        niv2 = data.Niveau2;
        niv3 = data.Niveau3;
        printScore();

      }).catch(function(err) {});
    }

  //Fonction pour l'affichage des scores
  var printScore = function(){
    var niv1S = document.getElementById("niv1S");
    var niv2S = document.getElementById("niv2S");
    var niv3S = document.getElementById("niv3S");

    niv1S.textContent = niv1;
    niv2S.textContent = niv2;
    niv3S.textContent = niv3;
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
//end

//fonction qui active le canvas, affiche le plateau de jeu
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
        init();

    }).catch(function(err) {
    });
  }
//end

//fonction d'initialisation du snake, nourriture, musique et répétition de la fonction paint
  var init = function(){
    direction = 'down';
    drawSnake();
    createFood();
    game.play();
    gameloop = setInterval(paint, delay);
  }
//end

//--------------------------------------------------------------------------end initialisation--------------------------------------------------------------


//--------------------------------------------------------------------------Fonctions d'affichage----------------------------------------------------------

//fonction qui affiche les murs d'un nivau s'il en a
  var createWalls = function(){
    for(var i = 0; i<walls.length; i++){
      ctx.fillStyle = 'red';
      ctx.fillRect(walls[i][0]*snakeSize, walls[i][1]*snakeSize, snakeSize, snakeSize);
    }
  }
//end

//fonction qui affiche le corps du serpent
  var bodySnake = function(x, y) {
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
    ctx.strokeStyle = 'lightgray';
    ctx.strokeRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
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

    return false;
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
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
  //end

  //desactivation des éléments persistants sur le canvas (menu)
    left.style.display="none";
    right.style.display="none";
    exit.style.display="none";
    circle.style.display="none";
  //end

  //récuperation position serpent
    var snakeX = snake[0].x;
    var snakeY = snake[0].y;
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
      sound(0); //lance le bruitage holywoodien
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
      bodySnake(snake[i].x, snake[i].y);
    }

    createWalls(); //affiche les murs
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
