/**
*
* Jesús Vázquez Pigueiras
* Práctica 1
*
**/

/*==================================
=            MemoryGame            =
==================================*/

/**
* MemoryGame
* Esta clase guarda un array con las cartas y el estado en el que se encuentra
* el juego en cada momento, por lo que es la responsable de decidir cuándo ha
* terminado el juego. También guarda el mensaje que aparece en pantalla y que
* se irá cambiando a medida que interactuamos con el juego. También ha de tener
* una referencia al servidor gráfico para poder dibujar el estado del juego. Esta
* clase ha de implementar al menos los siguientes métodos:
**/

/**
*
* MemoryGame(gs): La constructora recibe como parámetro el servidor grá-
* fico, usado posteriormente para dibujar.
*
**/
MemoryGame = function(gs) {
	this.gs = gs; /* Referencia al graphic server */
	this.cards = new Array(); /* array de cartas */
	this.cardActive1; /* primera carta que levanto */
	this.numActiveCards = 0; /* numero de cartas levantadas */
	this.message = "Memory Game" /* mensaje a mostrar */
	this.pairs = 0; /* numero de parejas encontradas */
};

MemoryGame.prototype = {
	 /**
	 *
	 * initGame(): Inicializa el juego añadiendo las cartas, desordenándolas y
	 * comenzando el bucle de juego.
	 *
	 **/
	 initGame: function () {
	 	var i = 0;
	 	// Inicializamos el array de cartas
	 	for(card in this.gs.maps) {
	 		if(card != "back") {
	 			//if(card.eq)
		 		this.cards[i] = new Card(card);
		 		this.cards[i+1] = new Card(card);
		 		i = i+2;	
	 		}
	 	}
	 	// Desordena las cartas.
	 	this.cards.sort(function() { return Math.random() - 0.5 });
	 	// Comenzamos el bucle del juego
	 	this.loop();
	 },

	/**
	*
	* draw(): Dibuja el juego, esto es: (1) escribe el mensaje con el estado actual
	* del juego y (2) pide a cada una de las cartas del tablero que se dibujen.
	*
	**/
	draw: function () {
		this.gs.drawMessage(this.message);
		var j;
		for(var card in this.cards) {
			this.cards[card].draw(this.gs, card);
		}
	},

	/**
	*
	* loop(): Es el bucle del juego. En este caso es muy sencillo: llamamos al
	* método draw cada 16ms (equivalente a unos 60fps). esto se realizará con
	* la función setInterval de Javascript.
	*
	**/
	loop: function () {
		var self = this;
		time = setInterval(function() {
			self.draw()
		}, 16);
	},

	/**
	*
	* onClick(cardId): Este método se llama cada vez que el jugador pulsa
	* sobre alguna de las cartas (identificada por el número que ocupan en el
	* array de cartas del juego). Es el responsable de voltear la carta y, si hay
	* dos volteadas, comprobar si son la misma (en cuyo caso las marcará como
	* encontradas). En caso de no ser la misma las volverá a poner boca abajo1 .
	*
	**/
	onClick: function (cardId) {
		if(this.pairs != 8) {
			if(cardId >= 0 || cardId <= 15) {
				if(this.numActiveCards == 0) {
					this.numActiveCards++;
					this.cards[cardId].flip();	
					this.cardActive1 = cardId;
				} else if(this.numActiveCards == 1) {
					if(cardId != this.cardActive1) {
						this.numActiveCards++;
						this.cards[cardId].flip();
						if(this.cards[cardId].compareTo(this.cards[this.cardActive1])) {
							this.numActiveCards = 0;
							this.cards[this.cardActive1].found();
							this.cards[cardId].found();
							this.pairs++;
							if(this.pairs == 8) {
								this.message = "You Win!!"
							} else {
								this.message = "Match Found!!";		
							}
						} else {
							var self = this;
							self.message = "Try again";
							setTimeout(function() {
								self.cards[self.cardActive1].flip();
								self.cards[cardId].flip();	
								self.numActiveCards = 0;
							}, 1000);	
						}
					}
				}
			}	
		} else {
			clearInterval(time);
		}
		
	}

};

/*-----  End of MemoryGame  ------*/



/*=======================================
=            MemoryGame.Card            =
=======================================*/

/**
*
* MemoryGame.Card
* Esta clase representa la cartas del juego. Una carta se identifica por el nombre
* del sprite que la dibuja2 y puede estar en tres posibles estados: boca abajo,
* boca arriba o encontrada. Esta clase ha de implementar al menos los siguientes
* métodos:
*
**/

/**
*
* Memory.Card(sprite): Constructora que recibe el nombre del sprite que
* representa la carta. Las cartas han de crearse boca abajo.
*
**/
Card = function(sprite) {
	this.sprite = sprite;
	this.state = "abajo"; // Estado de la carta. Ejemplos: abajo, arriba, encontrada
};

Card.prototype = {
	/**
	*
	* flip(): Da la vuelta a la carta, cambiando el estado de la misma.
	*
	**/
	flip: function () {
		if(this.state == "abajo") 
			this.state = "arriba";
		else if(this.state == "arriba")
			this.state = "abajo";
		
	},

	/**
	*
	* found(): Marca una carta como encontrada, cambiando el estado de la
	* misma.
	*
	**/
	found: function () {
		this.state = "encontrada";
	},

	/**
	*
	* compareTo(otherCard): Compara dos cartas, devolviendo true si ambas
	* representan la misma carta.
	*
	**/
	compareTo: function (otherCard) {
		return this.sprite == otherCard.sprite;
	},

	/**
	*
	* draw(gs, pos): Dibuja la carta de acuerdo al estado en el que se encuentra.
	* Recibe como parámetros el servidor gráfico y la posición en la que se
	* encuentra en el array de cartas del juego (necesario para dibujar una
	* carta).
	*
	**/
	draw: function (gs,pos) {
		if(this.state == "abajo") 
			gs.draw("back", pos);
		else
			gs.draw(this.sprite, pos);
	}
};

/*-----  End of MemoryGame.Card  ------*/