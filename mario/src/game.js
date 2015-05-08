/**
*
* Jesus Vazquez Pigueiras
* Practica 3
*
**/

var game = function() {
	// Set up an instance of the Quintus engine and include
	// the Sprites, Scenes, Input and 2D module. The 2D module
	// includes the `TileLayer` class as well as the `2d` componet.
	var Q = window.Q = Quintus()
		.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX")
		// Maximize this game to whatever the size of the browser is
		.setup({width: 320, height: 480})
		// And turn on default input controls and touch input (for UI)
		.controls().touch();

	//Q.input.mouseControls();
	//Q.input.keyboardControls();

	// Load Map
	Q.loadTMX("level.tmx, tiles.png", function(){
		Q.stageScene('startGame');
		//Q.stageScene("level1");
	});

	// Load Player
	Q.load("mario_small.png, mario_small.json, goomba.png, goomba.json, bloopa.png, bloopa.json, princess.png, mainTitle.png, coin.json, coin.png", function() {
		// Load Mario
		Q.compileSheets("mario_small.png","mario_small.json");
		// Load Goomba
		Q.compileSheets("goomba.png","goomba.json");
		// Load Bloopa
		Q.compileSheets("bloopa.png","bloopa.json");
		// Load Coin
		Q.compileSheets("coin.png","coin.json");
		//Q.compileSheets("princess.png");
	});

	// Load Level 1
	Q.scene("level1",function(stage) {
		Q.stageTMX("level.tmx",stage);
		var player = stage.insert(new Q.Mario());
		var goomba = stage.insert(new Q.Goomba({x: 300, y: 528}));
		var goomba = stage.insert(new Q.Goomba({x: 500, y: 528}));
		var bloopa = stage.insert(new Q.Bloopa({x: 150, y: 528}));
		var bloopa = stage.insert(new Q.Bloopa({x: 420, y: 528}));
		var bloopa = stage.insert(new Q.Bloopa({x: 1407, y: 460}));
		var coin = stage.insert(new Q.Coin({x: 70, y: 468}));
		var coin = stage.insert(new Q.Coin({x: 220, y: 428}));
		var coin = stage.insert(new Q.Coin({x: 540, y: 468}));
		var coin = stage.insert(new Q.Coin({x: 1303, y: 434}));
		var princess = stage.insert(new Q.Princess());
		Q.state.reset({ score: 0});
		Q.stageScene("stats", 1);
		stage.add("viewport");
		stage.follow(player);
		stage.viewport.offsetX = -110;
		stage.viewport.offsetY = 155;
	});

/*==================================
=            Animations            =
==================================*/

Q.animations('marioAnimated', {
	// Right
	stand_right: {frames: [0]},
	run_right: {frames: [1,2,3], rate: 0.23},
	jump_right: {frames: [4]},

	// Left
	stand_left: {frames:[14]},
	run_left: {frames: [15,16,17]},
	jump_left: {frames: [18]},

	// Death
	death: {frames:[12]}
});

Q.animations('goombaAnimated', {
	run: {frames: [0,1], rate: 0.23},
	death: {frames: [2]}
});

Q.animations('bloopaAnimated', {
	run: {frames: [0,1], rate: 0.23},
	death: {frames: [2]}
});

Q.animations('coinAnimated', {
	run: {frames: [0,1,2], rate: 0.5},
});

// var coin = new Q.Coin() {x: this.p.x, y: this.p.y])
//.animate({y: this.p.y - 57}, 0,25, {callback:function(){coin.destry();}})

/*-----  End of Animations  ------*/

/*==============================
=            Mario             =
==============================*/

Q.Sprite.extend("Mario",{
 
	init: function(p) {

		this._super(p, {
			sprite: "marioAnimated",
			sheet: "marioR",
			x: 20,
			y: 300,
			vx: 0,
			vy: 0,
			rate: 0.23,
			frame: 0,
			jumpSpeed: -380,
			type: Q.SPRITE_PLAYER,
			coins: 0
		});
		this.add('2d, platformerControls, animation, tween');
	},

	step: function(dt) {

		this.checkFall();
		if(this.p.vx == 0 && this.p.vy == 0)
			if(this.p.direction == "right")
				this.play("stand_right");
			else
				this.play("stand_left");
		else if(this.p.vx > 0) {
			if(this.p.vy == 0)
				this.play("run_right");
			else
				this.play("jump_right");
		} else if(this.p.vx < 0) {
			if(this.p.vy == 0)
				this.play("run_left");
			else
				this.play("jump_left");
		}
	},

	checkFall: function() {
		if(this.p.y > 850)
			this.restart();
	},

	restart: function() {
		this.p.x = 20;
		this.p.y = 300;
	},

	addCoin: function() {
		this.p.coins++;
		Q.state.set("score",this.p.coins);
	}

});

/*-----  End of Mario  ------*/

/*==============================
=            Goomba            =
==============================*/

Q.Sprite.extend("Goomba",{
	init: function(p) {

		this._super(p, {
			sprite: "goombaAnimated",
			sheet: "goomba",
			vx: 100,
			frame: 0
		});

		this.add('2d, aiBounce, animation, tween, defaultEnemy');


		this.on("bump.left,bump.right",this, "dieUp");
		this.on("bump.bottom",this, "dieDown");


		this.on("bump.top",this, "killStatic");
	},
	step: function(dt) {
		this.play("run");
	}
});

/*-----  End of Goomba  ------*/

/*==============================
=            Bloopa            =
==============================*/

Q.Sprite.extend("Bloopa",{
	init: function(p) {
		this._super(p, {
			sprite: "goombaAnimated",
			sheet: "bloopa",
			vy: -100,
			gravity: 0,
			dir: -1,
			times: 45,
			maxY: 460
		});
		this.add('2d, commonEnemy, animation, tween, defaultEnemy');


		this.on("bump.left,bump.right",this, "dieUp");

		this.on("bump.bottom",this, "dieDown");

		this.on("bump.top",this, "killDynamic");
	},

	step: function(dt) {
		if(this.p.dir == -1) {
			this.p.vy = 50;
		} else if(this.p.dir == 1) {
			this.p.vy = -50;
		}
		if(this.p.times == 80) {
			this.p.dir = this.p.dir*-1;
			this.p.times = 0;
		}
		this.p.times++;
		// Animation
		this.play("run");
	}
});

/*-----  End of Bloopa  ------*/

/*================================
=            Princess            =
================================*/

Q.Sprite.extend("Princess",{
	init: function(p) {

		this._super(p, {
			asset: "princess.png",
			x: 1918,
			y: 460,
			frame: 0
		});

		this.add('2d');


		this.on("bump.left,bump.right, bump.top",function(collision) {
			if(collision.obj.isA("Mario")) { 
				Q.stage().pause();
				Q.stageScene("winGame",1, { label: "You Win" }); 
			}
		});
	}
});

/*-----  End of Princess  ------*/

/*=============================
=            Coins            =
=============================*/

Q.Sprite.extend("Coin",{
	init: function(p) {

		this._super(p, {
			sprite: "coinAnimated",
			sheet: "coin",
			gravity: 0,
			frame: 0
		});

		this.add('2d, animation, tween');

		this.on("bump.left,bump.right, bump.top, bump.bottom",function(collision) {
			if(collision.obj.isA("Mario")) { 
				this.animate(
					{y: this.p.y - 37}, 
					0.3, 
					{callback:function(){
						this.destroy();
						collision.obj.addCoin();
					}});
			}
		});

		
	},

	step: function() {
		this.play("run");
	}
});


/*-----  End of Coins  ------*/

/*======================================
=            End Game Scene            =
======================================*/

// To display a game over / game won popup box,
// create a endGame scene that takes in a `label` option
// to control the displayed message.
Q.scene('endGame',function(stage) {
	var container = stage.insert(new Q.UI.Container({
		x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
	}));
	var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
		label: "Play Again" }))
	var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h,
		label: stage.options.label }));
	// When the button is clicked, clear all the stages
	// and restart the game.
	button.on("click",function() {
		Q.clearStages();
		Q.stageScene('level1');
	});
	// Expand the container to visibily fit it's contents
	// (with a padding of 20 pixels)
	container.fit(20);
});


/*-----  End of End Game Scene  ------*/

/*======================================
=            Win Game Scene            =
======================================*/

// To display a game over / game won popup box,
// create a endGame scene that takes in a `label` option
// to control the displayed message.
Q.scene('winGame',function(stage) {
	var container = stage.insert(new Q.UI.Container({
		x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
	}));
	var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
		label: "Play Again" }))
	var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h,
		label: stage.options.label }));
	// When the button is clicked, clear all the stages
	// and restart the game.
	button.on("click",function() {
		Q.clearStages();
		Q.stageScene('level1');
	});


	// Expand the container to visibily fit it's contents
	// (with a padding of 20 pixels)
	container.fit(20);
});

/*-----  End of Win Game Scene  ------*/


/*=======================================
=            Main Menu Scene            =
=======================================*/

// To display a game over / game won popup box,
// create a endGame scene that takes in a `label` option
// to control the displayed message.
Q.scene('startGame',function(stage) {
	var bg = stage.insert(new Q.Background({type: Q.SPRITE_UI}));
	bg.on("touch", function() {
		Q.clearStages();
		Q.stageScene('level1');
	});
	bg.on("click",function() {
		Q.clearStages();
		Q.stageScene('level1');
	});
	Q.input.on("confirm", function() {
		if(Q.stage().scene.name == "startGame") {
			Q.clearStages();
			Q.stageScene("level1");
		}
	});

});


Q.Sprite.extend("Background", {
	init: function(p) {
		this._super(p, {
			x: Q.width/2,
			y: Q.height/2,
			asset: 'mainTitle.png'
		});
	}
});

/*-----  End of Main Menu Scene  ------*/

/*==================================
=            Stats            =
==================================*/

Q.UI.Text.extend("Score", {
	init: function(p) {
		this._super({
			label: "Coins x0",
			x: 150,
			y: 50
		});
		Q.state.on("change.score", this, "score");
	},

	score: function(score) {
		this.p.label = "Coins x" + score;
	}
});

Q.scene("stats", function(stage) {
	var statsContainer = stage.insert(new Q.UI.Container({
			x: 0,
			y: 0
		})
	);
	var coinsLabel = stage.insert(new Q.Score(), statsContainer);
});

/*-----  End of Stats  ------*/



/*=====================================
=            Default Enemy            =
=====================================*/

Q.component("defaultEnemy", {
	extend: {
		dieUp: function(collision) {
			if(collision.obj.isA("Mario")) { 
				collision.obj.play("death", 1);
				collision.obj.animate(
						{y: this.p.y - 67},
						0.2,
						{
							callback: this.destroy
						}

					);
				Q.stageScene("endGame",1, { label: "You Loose" }); 
			}
		},

		dieDown: function(collision) {
			if(collision.obj.isA("Mario")) { 
				collision.obj.play("death", 1);
				collision.obj.animate(
						{y: this.p.y + 67},
						0.2,
						{
							callback: this.destroy
						}

					);
				Q.stageScene("endGame",1, { label: "You Loose" }); 
			}
		},

		// Para enemigos que deban morir sin efecto
		killStatic: function(collision) {
			if(collision.obj.isA("Mario")) { 
				this.play("death", 1);
				this.animate(
					{y: this.p.y}, 
					0.2, 
					{callback:function(){
						this.destroy();
					}});
			}
		},

		// Para enemigos que deban morir con efecto
		killDynamic: function(collision) {
			if(collision.obj.isA("Mario")) { 
				this.play("death", 1);
				this.animate(
					{y: this.p.y + 27}, 
					0.2, 
					{callback:function(){
						this.destroy();
					}});
			}
		}

	}
});


/*-----  End of Default Enemy  ------*/




};