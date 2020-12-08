/*global Path*/
/*global view*/
/*global Point*/
/*global $*/
$(document).ready(function() {

	var socket = io();

	// globals
	//var mapWidth = view.size.width;
	//var mapHeight = view.size.height;

	var keyW = false;
	var keyA = false;
	var keyS = false;
	var keyD = false;

	// the input system will tick slowly.
	var inputFPS = 2;  // 2 frames per second
	var inputFrameTime = 1000/inputFPS; // Approx. 500ms per frame

	var playerList = [];
	// var mapData = [];
	var timerCount = 0;

	socket.emit('enter_game', { userName: userName, alias: displayName } );

	socket.on('game_entered', () => {
		console.log("Entered the game")
		// fire up the "input system"
		initializeInput();
	});

	socket.on('update players', (data) => {
		playerList = data.players;
		render(data.players);
	});

	// functions
	function initializeInput() {
		window.addEventListener("keydown", onKeyDown, false);
		window.addEventListener("keyup", onKeyUp, false);
		
		//add timer
		var timer = setInterval(()=>{
			timerCount++;
		},1000);
		$("#timer").text("Clock: " + timerCount);

		setInterval(function() {
			socket.emit("update player", { 
				wasdState: { w: keyW, a: keyA, s: keyS, d: keyD }
			});
			// console.log(`Input State: W: ${keyW} A: ${keyA} S: ${keyS} D: ${keyD}`);
		}, inputFrameTime);
	};

	function render(players) {
		
  		var canvas = document.getElementById("myCanvas");
		var context = canvas.getContext("2d");
		
		// clear the canvas to that color from the css sheet.
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.rect(0, 0, canvas.width, canvas.height);
		context.fillStyle = "black";
		context.fill();

		console.log(JSON.stringify(players));

		// begin drawing circles
		players.forEach(player => {
			context.beginPath();
			// draw the player
			context.arc(player.x, player.y, 20, 0, Math.PI * 2, false);
			context.fillStyle = player.color;
			context.fill();
			// draw the "aura" for a glow effect.
			context.arc(player.x, player.y, 21, 0, Math.PI * 2, false);
			context.fillStyle = "orange";
			context.stroke();
			context.closePath();
		});

		$("#timer").text("Clock: " + timerCount);
	};

	function onKeyDown(event) {
		var keyCode = event.keyCode;
		switch (keyCode) {
		  case 68: //d
			 keyD = true;
			 break;
		  case 83: //s
			 keyS = true;
			 break;
		  case 65: //a
			 keyA = true;
			 break;
		  case 87: //w
			 keyW = true;
			 break;
		}
	 }
	 
	 function onKeyUp(event) {
		var keyCode = event.keyCode;
	 
		switch (keyCode) {
		  case 68: //d
			 keyD = false;
			 break;
		  case 83: //s
			 keyS = false;
			 break;
		  case 65: //a
			 keyA = false;
			 break;
		  case 87: //w
			 keyW = false;
			 break;
		}
	 }

	// event listeners

	
});