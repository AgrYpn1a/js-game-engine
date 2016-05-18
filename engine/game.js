/*! 
 * _____________________
 * |***	***********	***|
 * |***	GAME ENGINE	***|
 * |***	***********	***|
 * ---------------------
 *
 * SimpleCanvas GameEngine JavaScript Library v1.0
 * http://mywebsite.com/
 *
 * Copyright 2016, Rastko Tojagic
 * Released under GNU General Public Licence
 * http://licence.link/licence
 * 
 * Date: 2016-05-16

 *	
 * A JavaScript framework, written by Rastko Tojagic, 2016
 *	
 * Version 1.0.0
 *	
 * This javascript framework provides basic functions needed
 * to create a game with html5 canvas and js.
 *
 */
;
(function (global) {
	var Game = function (w, h) {
		return new Game.init(w, h);
	};

	Game.init = function (w, h) {
		/*
			Initialize DOM
		*/
		// set default parameters if not provided
		w = w || 800;
		h = h || 600;

		// initialize canvas
		var canvas = global.document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		canvas.style.border = '5px solid #000';
		global.document.body.appendChild(canvas);

		// add properties to Game object
		this.canvas = canvas;

		/*
			MAIN PROPERTIES
		*/
		this.gui = [];

		// init event emmiter
		this.events = new Emitter();

		// init GUI
		this.cPad = new ControlPad(this, 0.88, 0.83);
	}

	Game.prototype = {

		createButton: function (id, img, x, y) {
			/*
				This method will add a new GUI element, a Button to the screen
			*/
			var b = new Button(this, id, img, x, y);
			this.gui.push(b);

			return b;
		},

		createEntity: function (name) {
			return new Entity(this, name);
		},

		/*
			A static entity is an object in the scene, that does not interact
			with any of the objects, nor can be controlled
			
			This function constructor is meant to create static elements in the scene
			such as background elements, decorative elements..
		*/
		createStaticEntity: function () {

		},

		/*
			ERROR LIST
		*/
		err: {
			missing_param: 'Error: missing parameters!'
		}
	}


	/*
	 *----------------------------------------------------------------------------
	 *	| PRIVATE FUNCTION CONSTRUCTORS AND VARIABLES |
	 *----------------------------------------------------------------------------
	 */

	var ControlPad = function (game, x, y) {
		var w = game.canvas.width;
		var h = game.canvas.height;

		var ctx = game.canvas.getContext('2d');

		var posX = x || 0;
		var posY = y || 0;

		this.btnTop = new Button(game, 'top', 'engine/img/arw_top.png', w * posX, h * posY - 64);
		this.btnBot = new Button(game, 'bot', 'engine/img/arw_bottom.png', w * posX, h * posY + 64);
		this.btnLeft = new Button(game, 'left', 'engine/img/arw_left.png', w * posX - 64, h * posY);
		this.btnRight = new Button(game, 'right', 'engine/img/arw_right.png', w * posX + 64, h * posY);

		game.gui = [];

		game.gui.push(this.btnTop);
		game.gui.push(this.btnBot);
		game.gui.push(this.btnRight);
		game.gui.push(this.btnLeft);


		ctx.fillStyle = '#ccc';
		ctx.fillRect(0, 0, 800, 600);

		// handle click events
		game.canvas.addEventListener('mousedown', function (event) {
			var x = event.x;
			var y = event.y;

			var canvas = this;

			x -= canvas.offsetLeft;
			y -= canvas.offsetTop;

			/*
				Now we have to check if the click on canvas
				happend on any of our ControlPad elements
			*/
			for (var i = 0; i < game.gui.length; i++) {
				game.gui[i].inRange(x, y);
			}

		}, false);

		return this;
	};

	/*
		USER INTERFACE
	*/
	var Button = function (game, id, img, x, y) {
		if (!id) {
			throw new Error(game.err.missing_param);
			return null;
		}

		this.id = id;
		// image
		this.image = new Image();
		this.image.src = img;

		this.rotation = 0;
		this.game = game;
		this.ctx = game.canvas.getContext('2d');

		this.position = {
			x: x - this.image.width / 2,
			y: y - this.image.height / 2
		};

		this.initDrawImage();

	};

	Button.prototype = {
		setPosition: function (x, y) {
			if (!x || !y)
				throw new Error(err.missing_param);

			this.position.x = x;
			this.position.y = y;
			this.drawImage();
		},

		initDrawImage: function () {
			var g = this;
			this.image.onload = function () {
				g.ctx.drawImage(g.image, g.position.x, g.position.y, g.image.width, g.image.height);
			}
		},

		drawImage: function () {
			this.ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height);
		},

		inRange: function (x, y) {
			var lDist = this.position.x,
				rDist = this.position.x + this.image.width,
				tDist = this.position.y,
				bDist = this.position.y + this.image.height;

			if (x > lDist && x < rDist && y > tDist && y < bDist) {
				this.onMouseDown();
			}
		},

		onMouseDown: function () {
			this.me();
		},

		me: function () {
			console.log('Button ' + this.id + ' reporting a click!');
		}
	};

	/*
		Game entity is any object in the scene, that can interact
		with other objects(entities), and/or be controlled by player

		This method will create new game entity
	*/
	var Entity = function (g, name) {
		/*
			Each entity will exist within a div, with the custom attributes
		*/

		// handle missing parameter errors
		// we wnat to make sure user passes a name 
		// for the entity
		if (!name)
			throw new Error(this.err.missing_param);

		var img = new Image();
		var entity = g.canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

		/*
			Properties unique for each entity 
		*/
		this.position = {
			x: 0,
			y: 0
		}

		this.src = '';
	};

	Entity.prototype = {
		/*
			After we have initialized an empty entity
			we want to be able to manipulate it
			
			Following methods will allow this to happen
		*/
		addSprite: function () {
			console.log('Added sprite!');
		},

		/*
			This method will return object, containing x and y coordinates
		*/
		getPos: function () {
			return {
				x: this.top,
				y: this.left
			}
		}
	};

	Game.init.prototype = Game.prototype;

	global.Game = Game;
}(this));