/**
*
* Jesús Vázquez Pigueiras
* Practica 2
*
**/


/*===================================================
=            Sprites, Objects and Levels            =
===================================================*/

var sprites = {
  frog: { sx: 0, sy: 0, w: 48, h: 48, frames: 1 },
  bg: { sx: 433, sy: 0, w: 320, h: 480, frames: 1 },
  home: {sx: 433, sy: 0, w: 320, h: 48, frames: 1 },
  water: {sx: 433, sy: 49, w: 320, h: 144, frames: 1 },
  car1: { sx: 143, sy: 0, w: 48, h: 48, frames: 1 },
  car2: { sx: 191, sy: 0, w: 48, h: 48, frames: 1 },  
  car3: { sx: 239, sy: 0, w: 96, h: 48, frames: 1 },
  car4: { sx: 335, sy: 0, w: 48, h: 48, frames: 1 },
  car5: { sx: 383, sy: 0, w: 48, h: 48, frames: 1 },
  trunk: { sx: 288, sy: 383, w: 142, h: 48, frames: 1 },
  death: { sx: 0, sy: 143, w: 48, h: 48, frames: 4 }
};

var objects = {
  car1: {sprite: 'car1'},
  car2: {sprite: 'car2'},
  car3: {sprite: 'car3'},
  car4: {sprite: 'car4'},
  car5: {sprite: 'car5'},
  trunk: {sprite: 'trunk'},
  trunk2: {sprite: 'trunk'},
  trunk3: {sprite: 'trunk'}
};

var OBJECT_FROG = 2, // FROG
    OBJECT_CAR = 3,
    OBJECT_TRUNK = 1,
    OBJECT_WATER = 4,
    OBJECT_HOME = 5,
    OBJECT_BACKGROUND = 6,
    OBJECT_DEATH = 8;


var level1 = [
 // Start,   End,  Gap, ObjectName,         Override                 Type
 [     0,     -1,  1600,  'car5',   { Speed: 300, X:  -50, Y: 384 } , 'car'   ],
 [     0,     -1,  2500,  'car1',   { Speed: -150, X: 320, Y: 336 } , 'car'   ],
 [     0,     -1,  2600,  'car3',   { Speed: -100, X:  320, Y: 288 } , 'car'  ],
 [     0,     -1,  2700,  'car2',   { Speed: 160, X:  -50, Y: 240 } , 'car'   ],
 [     0,     -1,  2600,  'trunk',  { Speed: -150, X:  320, Y: 144 } , 'trunk'],
 [     0,     -1,  3020,  'trunk',  { Speed: 130, X:  -140, Y: 96 } , 'trunk' ],
 [     0,     -1,  2900,  'trunk',  { Speed: -130, X:  320, Y: 48 } , 'trunk' ]
];

/*-----  End of Sprites, Objects and Levels  ------*/

/*===========================================
=            Main game functions            =
===========================================*/

var startGame = function() {
  var ua = navigator.userAgent.toLowerCase();
  Game.setBoard(0,new BackGround());
  Game.setBoard(3,new TitleScreen("FROGGER", 
                                  "PRESS ENTER TO START PLAYING",
                                  playGame));
};

var playGame = function() {
  var board = new GameBoard();
  board.add(new Frog());
  board.add(new Water());
  board.add(new Home());
  board.add(new Level(level1,winGame));
  Game.setBoard(3,board);
  Game.setBoard(5,new GamePoints(0));
  Game.setBoard(4,new TitleScreen("", ""));
};

var winGame = function() {
  Game.setBoard(4,new TitleScreen("YOU WIN!", 
                                  "PRES ENTER TO PLAY AGAIN",
                                  playGame));
};

var loseGame = function() {
  Game.setBoard(4,new TitleScreen("YOU LOOSE!", 
                                  "PRESS ENTER TO PLAY AGAIN",
                                  playGame));
};

/*-----  End of Main game functions  ------*/


/*==================================
=            Background            =
==================================*/

var BackGround = function() {
  this.setup('bg', {});
  this.x = 0;
  this.y = 0;
  this.step = function(){};

};
BackGround.prototype = new Sprite(); 
BackGround.prototype.type = OBJECT_BACKGROUND;

/*-----  End of Background  ------*/

/*============================
=            Frog            =
============================*/

var Frog = function() { 
  this.setup('frog', { vx: 0, reloadTime: 0.25, maxVel: 48 });
  this.reload = this.reloadTime;
  this.x = Game.width/2 - this.w / 2;
  this.y = Game.height;
  this.vx = 0;
  this.vy = 0;
  this.ontrunk = false;

  this.step = function() {

    // Deducimos la nueva direccion
    if(Game.keys['left']) { Game.keys['left'] = false; this.vx = -this.maxVel; }
    else if(Game.keys['right']) { Game.keys['right']= false; this.vx = this.maxVel; }
    else if(Game.keys['up']) { Game.keys['up'] = false; this.vy = -this.maxVel;}
    else if(Game.keys['down']) { Game.keys['down'] = false;this.vy = this.maxVel;}

    // Modificamos la posicion
    this.x += this.vx;
    this.y += this.vy;

    // Controlamos que la rana no se salga por los lados.
    if(this.x < 0) { this.x = 0; }
    else if(this.x > Game.width - this.w) { 
      this.x = Game.width - this.w;
    }
    // Controlamos que la rana no se salga ni por arriba ni por abajo
    if(this.y < 0) { this.y = 0; }
    else if(this.y > Game.height - this.h) { 
      this.y = Game.height - this.h;
    }

    this.vx = 0;
    this.vy = 0;
    this.ontrunk = false;

  };
};

Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_FROG;

Frog.prototype.hit = function() {
  if(!this.ontrunk)
    if(this.board.remove(this)) {
      this.board.add(new Death(this.x, this.y)); 
      loseGame();
    }
};

Frog.prototype.onTrunk = function(vx) {
  this.ontrunk = true;
  this.vx = vx;
};

Frog.prototype.win = function() {
  if(this.board.remove(this)) {
    winGame();  
  }
  
}

/*-----  End of Frog  ------*/

/*===========================
=            Car            =
===========================*/

var Car = function(blueprint, override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
  this.x = this.X;
  this.y = this.Y;
  this.vx = this.Speed;
};

Car.prototype = new Sprite();
Car.prototype.type = OBJECT_CAR;

Car.prototype.baseParameters = { Speed: 0, X: 0, Y: 0,
                                   t: 0, reloadTime: 0.75, 
                                   reload: 0 };

Car.prototype.step = function(dt) {
  this.t += dt;
  this.x += this.vx * dt;
  this.reload-=dt;

  // Controlamos las colisiones con la rana
  var collision = this.board.collide(this,OBJECT_FROG);
  if(collision) {
    collision.hit();
  }

  // Si sale de las dimensiones especificadas borramos el objeto
  if(this.y > Game.height ||this.x < -this.w || this.x > Game.width) {
       this.board.remove(this);
  }
};


/*-----  End of Car  ------*/

/*=============================
=            Trunk            =
=============================*/

var Trunk = function(blueprint, override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
  this.x = this.X;
  this.y = this.Y;
  this.vx = this.Speed;
 
};

Trunk.prototype = new Sprite();
Trunk.prototype.type = OBJECT_TRUNK;

Trunk.prototype.baseParameters = { Speed: 0, X: 0, Y: 0,
                                   t: 0, reloadTime: 0.75, 
                                   reload: 0 };

Trunk.prototype.step = function(dt) {
  this.t += dt;
  this.x += this.vx * dt;

  this.reload-=dt;

  var collision = this.board.collide(this,OBJECT_FROG);
  if(collision) {
    collision.onTrunk(this.vx*dt);
  }

  // Si sale de las dimensiones especificadas borramos el objeto
  if(this.y > Game.height ||this.x < -this.w || this.x > Game.width) {
       this.board.remove(this);
  }
};

/*-----  End of Trunk  ------*/

/*=============================
=            Water            =
=============================*/

var Water = function() {
  this.draw = function(){};
  this.setup('water', {});
  this.x = 0;
  this.y = 48;

};
Water.prototype = new Sprite(); 
Water.prototype.type = OBJECT_WATER;

Water.prototype.step = function(dt) {
  var collision = this.board.collide(this,OBJECT_FROG);
  if(collision) {
    collision.hit();
  }
};

/*-----  End of Water  ------*/

/*=============================
=            Home             =
=============================*/

var Home = function() {
  this.draw = function(){};
  this.setup('home', {});
  this.x = 0;
  this.y = 0;

};
Home.prototype = new Sprite(); 
Home.prototype.type = OBJECT_DEATH;

Home.prototype.step = function(dt) {
  var collision = this.board.collide(this,OBJECT_FROG);
  if(collision) {
    collision.win();
  }
};

/*-----  End of Home  ------*/

/*=============================
=            Death            =
=============================*/

var Death = function(x, y) {
  this.setup('death', {frame: 0});
  this.x = x;
  this.y = y;
  this.aux = 0;
};

Death.prototype = new Sprite(); 
Death.prototype.type = OBJECT_DEATH; 

Death.prototype.step = function(dt) {
  this.frame = Math.floor(this.aux++ / 8);
  if(this.aux >= 24)
    this.board.remove(this);
};

/*-----  End of Death  ------*/

/**
*
* Comienza el juego
*
**/
window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});


