var game = Game(1200, 800);
//game.createButton('myButton', '/img/test.jpg', 120, 120);

game.events.on('update', function () {
	//console.log('Update me...');
});

game.events.on('update', function () {
	//console.log('Update me, from another...');
});

var player = game.createEntity('player', '/img/player.png', 150, 150, true);