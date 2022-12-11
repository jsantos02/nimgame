"use strict";

var username;
var password;
var group = 16;
var loginFlag = false;
var divsArray = ["homePageDiv", "gameFormDiv", "gameDiv", "restartGameDiv", "leaveGameDiv", "rankingDiv", "rulesDiv"];
var mainGame;
var gameInProgress = false;
var evtSource;
var timeOutMessage;
var timer;
var timeLeft;
var singleORmulti;

var url = "http://twserver.alunos.dcc.fc.up.pt:8008/";

function showFrontPage(){
	for(var i=0; i<divsArray.length; i++)
		document.getElementById(divsArray[i]).style.display = "none";

	document.getElementById("homePageDiv").style.display = "block";
}

function showSingleplayerOptions(){
	document.getElementById("singleplayerOptionsDiv").style.display = "block";
	document.getElementById("multiplayerOptionsDiv").style.display = "block";
}

function showMultiplayerOptions(){
	document.getElementById("singleplayerOptionsDiv").style.display = "none";
	document.getElementById("multiplayerOptionsDiv").style.display = "block";
}

function showGameForm(goodPassword, goodBoardSize){
	for(var i=0; i<divsArray.length; i++)
		document.getElementById(divsArray[i]).style.display = "none";

	if(gameInProgress){
		document.getElementById("gameDiv").style.display = "block";
		document.getElementById("leaveGameDiv").style.display = "block";
		return;
	}

	document.getElementById("userInputForm").reset();
	document.getElementById("gameTypeForm").reset();
	document.getElementById("difficultyForm").reset();
	document.getElementById("playFirstForm").reset();
	document.getElementById("boardSizeForm").reset();

	document.getElementById("gameFormDiv").style.display = "block";

	if(loginFlag==false){
		document.getElementById("loginDiv").style.display = "block";
		document.getElementById("gameTypeDiv").style.display = "none";
		document.getElementById("optionsDiv").style.display = "none";
	}
	else{
		document.getElementById("loginDiv").style.display = "none";
		document.getElementById("signUpDiv").style.display = "none";
		document.getElementById("optionsDiv").style.display = "block";
		document.getElementById("gameTypeDiv").style.display = "block";

		var spORmp = document.getElementById("gameTypeForm").elements["gameTypeButton"].value;

		if(spORmp == "singleplayer")
			showSingleplayerOptions();
		else
			showMultiplayerOptions();
	}

	if(goodPassword)
		document.getElementById("wrongPasswordText").style.display = "none";
	else
		document.getElementById("wrongPasswordText").style.display = "block";

	if(goodBoardSize)
		document.getElementById("wrongBoardSizeText").style.display = "none";
	else
		document.getElementById("wrongBoardSizeText").style.display = "block";
}

function showRanks(){
	for(var i=0; i<divsArray.length; i++)
		document.getElementById(divsArray[i]).style.display = "none";

	document.getElementById("rankingDiv").style.display = "block";

	showSingleplayerRanks();
}

function showSingleplayerRanks(){
	document.getElementById("boardSizeFormRanks").style.display = "none";

	for(var i=0; i<divsArray.length; i++)
		document.getElementById(divsArray[i]).style.display = "none";

	document.getElementById("rankingDiv").style.display = "block";
		
	var finalText = 
		"<div class='rankings'>" +
			"<table>" +
				"<tr>" +
					"<th>Jogador</th>" +
							"<th>Total de Jogos</th>" +
							"<th>Vitórias</th>" +
							"<th>Derrotas</th>" +
							"<th>Percentagem de vitórias</th>" +
				"</tr>";
	for(var i=0; i<localStorage.length; i++){
		var jsonUsername = localStorage.key(i);
		var json = JSON.parse(localStorage.getItem(localStorage.key(i)));
		finalText += 
			"<tr>" +
				"<td>" + jsonUsername + "</td>" +
				"<td>" + json.games + "</td>" +
				"<td>" + json.victories + "</td>" +
				"<td>" + (json.games - json.victories) + "</td>" +
				"<td>" + ((json.victories / json.games)*100).toFixed(2) + "%" + "</td>";
		finalText += "</tr>";
	}
	finalText += 
			"</table>" +
		"</div>";

	document.getElementById("tableRankingDiv").innerHTML = finalText;
}

function showMultiplayerRanksBoardSizeInput(){
	document.getElementById("boardSizeFormRanks").style.display = "block";
	document.getElementById("tableRankingDiv").innerHTML = "";
}

function showMultiplayerRanks(boardSize){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url+"ranking", true);

	xhr.onreadystatechange = function() {
		if(this.readyState < 4)
			return;
		else if(this.status == 200){
			var json = JSON.parse(this.responseText)["ranking"];
			
			var finalText = 
				"<div class='rankings'>" +
					"<table>" +
						"<tr>" +
							"<th>Jogador</th>" +
							"<th>Total de Jogos</th>" +
							"<th>Vitórias</th>" +
							"<th>Derrotas</th>" +
							"<th>Percentagem de vitórias</th>" +
						"</tr>";
			if(json != null){
				for(var j=0; j<json.length; j++){

					finalText += 
						"<tr>" +
							"<td>" + json[j].nick + "</td>" +
							"<td>" + json[j].games + "</td>" +
							"<td>" + json[j].victories + "</td>" +
							"<td>" + (json[j].games - json[j].victories) + "</td>" +
							"<td>" + ((json[j].victories / json[j].games)*100).toFixed(2) + "%" + "</td>";
					finalText += "</tr>";
				}
			}
			finalText += 
					"</table>" +
				"</div>";

			document.getElementById("tableRankingDiv").innerHTML = finalText;
		}
		else if(this.status == 400)
			document.getElementById("tableRankingDiv").innerHTML = "Número inválido";
	}

	xhr.send(JSON.stringify({"size": parseInt(boardSize)}));
}

function showRules(){
	for(var i=0; i<divsArray.length; i++)
		document.getElementById(divsArray[i]).style.display = "none";

	document.getElementById("rulesDiv").style.display = "block";
}

function showGameDiv(){
	for(var i=0; i<divsArray.length; i++)
		document.getElementById(divsArray[i]).style.display = "none";

	document.getElementById("gameDiv").style.display = "block";
}

function resetGameDiv(){
	var elem = document.getElementById("gameDiv");
	while (elem.firstChild)
		elem.removeChild(elem.firstChild);
}

function playGame(){
	if(document.getElementById("gameTypeForm").elements["gameTypeButton"].value == "singleplayer"){

		var dif = document.getElementById("difficultyForm").elements["difficultyButton"].value;

		var firstPlayer = document.getElementById("playFirstForm").elements["playFirstButton"].value;

		var boardSize = document.getElementById("boardSizeForm").elements["boardSizeInput"].value;

		if(boardSize%1!=0.0 || boardSize<=0){ //number with colon
			showGameForm(true, false);
			return;
		}

		mainGame = new nimGame(dif, firstPlayer, boardSize);

		mainGame.initiateGame();

		singleORmulti = "single";
	}
	else{
		var boardSize = document.getElementById("boardSizeForm").elements["boardSizeInput"].value;

		resetGameDiv();

		var messageH = document.createElement("h1");
		messageH.id = "messageH1";
		document.getElementById("gameDiv").appendChild(messageH);

		var timerH = document.createElement("h2");
		timerH.id = "timerH2";
		document.getElementById("gameDiv").appendChild(timerH);
		setTimer();
		showGameDiv();

		singleORmulti = "multi";

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url+"join", true);

		xhr.onreadystatechange = function() {
			if(this.readyState < 4)
				return;
			else if(this.status == 200){
				var gameId = JSON.parse(this.responseText)["game"];

				initiateEventSource(gameId);

				gameInProgress = true;

				messageH.innerHTML = "À espera de oponente";

				mainGame = new nimOnlineGame(gameId, boardSize);

				document.getElementById("leaveGameDiv").style.display = "block";
			}
			else if(this.status == 400){
				var json = JSON.parse(this.responseText);
				if(json["error"]=="Invalid size")
					messageH.innerHTML = "Erro! O tamanho do tabuleiro tem que ser um número positivo.";
				else
					messageH.innerHTML = "Erro! Não podes jogar contra ti mesmo.";
			}
			else if(this.status >= 500)
				messageH.innerHTML = "Erro! Não foi possível ligar ao servidor.";
		}

		xhr.send(JSON.stringify({"group": group, "nick": username, "password": password, "size": boardSize}));
	}
}
function setTimer(){
	timeLeft = 60000;
	clearInterval(timer);
	timer = setInterval(function() {

		var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

		document.getElementById("timerH2").innerHTML = minutes + "m " + seconds + "s ";

		if (timeLeft <= 0) {
			clearInterval(timer);
			if(singleORmulti == "single")
				document.getElementById("timerH2").innerHTML = "Tempo para jogar esgotou";
			else
				document.getElementById("timerH2").innerHTML = "Não foi encontrado um oponente";
			document.getElementById("leaveGameDiv").style.display = "none";
			if(document.getElementById("boardDiv")!=null)
				document.getElementById("boardDiv").style.display = "none";
			gameInProgress = false;
			leaveGame();
		}

		timeLeft=timeLeft-1000;
	}, 1000);
}
function restartGame(){
	playGame();
}

function login(){
	username = document.getElementById("userInput").value;
	password = document.getElementById("passwordInput").value;

	var js_obj = {"nick": username, "password": password};
	var json = JSON.stringify(js_obj);

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url+"register", true);

	xhr.onreadystatechange = function() {
		if(this.readyState < 4)
			return;
		else if(this.status == 200){
			document.getElementById("showLoginDiv").style.display = "block";
			document.getElementById("showLoginText").innerHTML = "Bem-vindo ao Nim," + username;
			loginFlag=true;
			if(localStorage[username] == null)
				localStorage[username] = JSON.stringify({"victories": 0, "games": 0});

			showGameForm(true, true);
		}
		else if(this.status == 400)
			showGameForm(false, true);
	}

	xhr.send(json);
}

function loginUponReg(){
	username = document.getElementById("userReg").value;
	password = document.getElementById("passwordReg").value;

	var js_obj = {"nick": username, "password": password};
	var json = JSON.stringify(js_obj);
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url+"register", true);
	
	xhr.onreadystatechange = function() {
		if(this.readyState < 4)
			return;
		else if(this.status == 200){
			document.getElementById("showLoginDiv").style.display = "block";
			document.getElementById("showLoginText").innerHTML = "Bem-vindo ao Nim," + username;
			loginFlag=true;
			if(localStorage[username] == null)
				localStorage[username] = JSON.stringify({"victories": 0, "games": 0});

			showGameForm(true, true);
		}
		else if(this.status == 400)
			showGameForm(false, true);
	}

	xhr.send(json);
}

function signUp() {
	username = document.getElementById("userReg").value;
	password = document.getElementById("passwordReg").value;

	const data = {"nick": username, "password": password};

	fetch(url+"register",{
		method:"POST",
		body: JSON.stringify(data),
	})
	.then(loginUponReg);
}


function logout(){
	if(gameInProgress){
		document.getElementById("showLoginText").innerHTML = "Não podes sair enquanto o jogo está em progresso!";
		setTimeout(function(){ document.getElementById("showLoginText").innerHTML = "Bem-vindo ao Nim," + username; }, 4000);
		return;
	}

	document.getElementById("showLoginDiv").style.display = "none";

	loginFlag=false;
	showFrontPage();
}

function leaveGame(){
	mainGame.leave();
}

function Board(x, y){
	this.boardQuantityArray = [];
	this.boardDivArray = [];
	this.xMax = x;
	this.yMax = y;
	this.boardDiv;
	
	this.createBoard = function(){
		this.boardDiv = document.createElement("div");
		this.boardDiv.className = "boardDiv";
		this.boardDiv.id = "boardDiv";
		this.boardDiv.style.width = "" + (90 * this.xMax) + "px";
		document.getElementById("gameDiv").appendChild(this.boardDiv);

		for(var i=0; i<this.yMax; i++){
			this.boardQuantityArray.push(i+1);
			var tempDiv = document.createElement("div");
			tempDiv.id  = "cellDiv" + i;
			tempDiv.className = "cellDiv";
			for(var j=i; j>=0; j--){
				var piece = new Piece(i, j);
				tempDiv.appendChild(piece.html);
			}
			this.boardDiv.appendChild(tempDiv);
		}
	}
}

function nimGame(dif, firstPlayer, boardSize){
	this.dif = dif;
	this.firstPlayer = firstPlayer;
	this.boardSize = boardSize;

	this.board;
	this.moves;
	this.pc;

	this.initiateGame = function(){
		this.board = new Board(this.boardSize, this.boardSize);
		this.pc = new PC(this.dif);
		this.moves = 0;

		gameInProgress = true;

		resetGameDiv();

		var messageH = document.createElement("h1");
		messageH.id = "messageH1";
		document.getElementById("gameDiv").appendChild(messageH);

	
		var timerH = document.createElement("h2");
		timerH.id = "timerH2";
		document.getElementById("gameDiv").appendChild(timerH);

		this.board.createBoard();

		showGameDiv();

		document.getElementById("leaveGameDiv").style.display = "block";

		this.updateMessageDiv();

		var _this = this;
		if(this.firstPlayer=="pc")
			setTimeout(function() {_this.pc.move(); }, 1500);
	}

	this.updateMessageDiv = function(){
		if((this.moves%2==0 && this.firstPlayer=="player") || (this.moves%2!=0 && this.firstPlayer!="player")){
			document.getElementById("messageH1").innerHTML = "É a vez de <ins>" + username + "</ins>!";
			setTimer();
		}
		else{
			document.getElementById("messageH1").innerHTML = "É a vez do <ins>Computador</ins>!";
			setTimer();
		}
	}

	this.deletePiece = function(x, y){
		for(var i=y; i<this.board.boardQuantityArray[x]; i++)
			document.getElementById("piece" + x + "|" + i).className = "pieceDeleted";

		this.board.boardQuantityArray[x]=y;

		if(this.checkGameOver()==true){
			this.endGame();
			return;
		}

		this.moves++;

		if(gameInProgress==true)
			this.updateMessageDiv();

		var _this = this;
		if((this.moves%2==0 && this.firstPlayer=="pc") || (this.moves%2!=0 && this.firstPlayer!="pc"))
			setTimeout(function() {_this.pc.move(); }, 1500);
	}

	this.checkGameOver = function(){
		var gameOver = true;
		for(var i=0; i<this.board.boardQuantityArray.length; i++){
			if(this.board.boardQuantityArray[i]>0)
				return false;
		}

		return true;
	}

	this.endGame = function(){
		if((this.moves%2==0 && this.firstPlayer=="player") || (this.moves%2!=0 && this.firstPlayer!="player")){
			var json = JSON.parse(localStorage[username])
			json["games"]++;
			json["victories"]++;
			localStorage[username] = JSON.stringify(json);
			document.getElementById("messageH1").innerHTML = "VITÓRIA! 🏆🥇";
		}
		else{
			var json = JSON.parse(localStorage[username])
			json["games"]++;
			localStorage[username] = JSON.stringify(json);
			document.getElementById("messageH1").innerHTML = "Perdeu 😔. Tenta outra vez!";
		}

		gameInProgress = false;

		document.getElementById("restartGameDiv").style.display = "block";
		document.getElementById("boardDiv").style.display = "none";
		document.getElementById("leaveGameDiv").style.display = "none";
		document.getElementById("timerH2").style.display = "none";
		
	}

	this.leave = function(){
		clearTimeout(timeOutMessage);
		var json = JSON.parse(localStorage[username])
		json["games"]++;
		localStorage[username] = JSON.stringify(json);
		document.getElementById("messageH1").innerHTML = "Perdeu 😔";

		gameInProgress = false;

		document.getElementById("restartGameDiv").style.display = "block";
		document.getElementById("boardDiv").style.display = "none";
		document.getElementById("leaveGameDiv").style.display = "none";
		document.getElementById("timerH2").style.display = "none";
		
		clearInterval(timer);
		
	}
}

function nimOnlineGame(gameId, boardSize){
	this.gameId = gameId;
	this.boardSize = boardSize;

	this.turn;
	this.board;

	this.initiateGame = function(firstPlayer){
		this.board = new Board(this.boardSize, this.boardSize);

		this.board.createBoard();

		this.turn = firstPlayer;
		this.updateMessageDiv();

		singleORmulti = "single";
	}

	this.updateMessageDiv = function(){
		clearTimeout(timeOutMessage);
		document.getElementById("messageH1").innerHTML = "É a vez do <ins>" + this.turn + "</ins>!";
	}

	this.deletePiece = function(x, y){                     // função notify
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url+"notify", true);

		xhr.onreadystatechange = function() {
			if(this.readyState < 4)
				return;
			else if(this.status == 400){
				var json = JSON.parse(this.responseText);
				if(json["error"] == "Not your turn to play"){
					document.getElementById("messageH1").innerHTML = "Não é o teu turno!";
					timeOutMessage = setTimeout("mainGame.updateMessageDiv()", 3000);
				}
				else{
					document.getElementById("messageH1").innerHTML = "A pilha tem um número negativo de peças!";
					timeOutMessage = setTimeout("mainGame.updateMessageDiv()", 3000);
				}
			}
		}

		xhr.send(JSON.stringify({"nick": username, "password": password, "game": this.gameId, "stack": x, "pieces": y}));
	}

	this.deletePieceConfirmation = function(x, y){
		for(var i=y; i<this.board.boardQuantityArray[x]; i++)
			document.getElementById("piece" + x + "|" + i).className = "pieceDeleted";

		this.board.boardQuantityArray[x]=y;
	}

	this.endGame = function(winner){
		clearTimeout(timeOutMessage);
		document.getElementById("messageH1").innerHTML = "O jogador <ins>" + winner + "</ins> ganhou! Parabéns! 🏆🥇";

		gameInProgress = false;

		document.getElementById("restartGameDiv").style.display = "block";
		document.getElementById("boardDiv").style.display = "none";
		document.getElementById("leaveGameDiv").style.display = "none";
		document.getElementById("timerH2").style.display = "none";
		clearInterval(timer);
		evtSource.close();
	}

	this.leave = function(){
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url+"leave", true);

		xhr.onreadystatechange = function() {
			if(this.readyState < 4)
				return;
			else if(this.status == 400){
				clearTimeout(timeOutMessage);
				document.getElementById("messageH1").innerHTML = "Error! Bad request.";
			}
		}

		xhr.send(JSON.stringify({"nick": username, "password": password, "game": this.gameId}));

		clearInterval(timer);
		
	}
}

function PC(dif){
	this.dif = dif;

	this.easyMove = function(){
		while(true){
			var x = Math.floor(Math.random() * mainGame.board.boardQuantityArray.length);
			if(mainGame.board.boardQuantityArray[x]>0){
				var y = Math.floor(Math.random() * mainGame.board.boardQuantityArray[x]);

				mainGame.deletePiece(x, y);
			
				break;
			}
		}
	}

	this.hardMove = function(){
		for(var i=0; i<mainGame.board.boardQuantityArray.length; i++){
			for(var j=0; j<mainGame.board.boardQuantityArray[i]; j++){
				var oldValue = mainGame.board.boardQuantityArray[i];
				mainGame.board.boardQuantityArray[i] = j;
				if(this.xor() != 0){
					mainGame.board.boardQuantityArray[i] = oldValue;
				}
				else{
					mainGame.board.boardQuantityArray[i] = oldValue;
					mainGame.deletePiece(i, j);

					return;
				}
			}
		}
		var x = Math.floor(Math.random() * mainGame.board.boardQuantityArray.length);
		while(mainGame.board.boardQuantityArray[x]==0)
			x = Math.floor(Math.random() * mainGame.board.boardQuantityArray.length);
		mainGame.deletePiece(x, mainGame.board.boardQuantityArray[x]-1);
	}

	this.xor = function(){
		var value = 0;
		for(var i=0; i<mainGame.board.boardQuantityArray.length; i++)
			value ^= mainGame.board.boardQuantityArray[i];

		return value;
	}

	this.move = function(){
		switch(this.dif){
			case "easy": 
				this.easyMove();
				break;

			case "normal": 
				var rand = Math.floor(Math.random() * 2);

				if(rand==0)
					this.easyMove();
				else
					this.hardMove();

				break;

			case "hard":
				this.hardMove();
				break;

			default:
				break;
		}
	}
}

function Piece(x, y){
	this.x = x;
	this.y = y;
	this.html = document.createElement("img");
	this.html.className = "piece";
	this.html.id = "piece" + x + "|" + y;
	this.html.src = "https://cdn.discordapp.com/attachments/760658720136495114/1034781460500070400/piece.png";

	this.html.onmouseover = function(){
		if(this.className!="pieceDeleted" && ((mainGame.moves%2==0 && mainGame.firstPlayer=="player") || (mainGame.moves%2!=0 && mainGame.firstPlayer!="player"))){
			this.className = "pieceHovered";
			var length = this.id.length;
			var temp = this.id.indexOf("|");
			var x = parseInt(this.id.slice(5, temp));
			var y = parseInt(this.id.slice(temp+1, length));
			for(; y<mainGame.board.boardQuantityArray[x]; y++)
				document.getElementById("piece" + x + "|" + y).className = "pieceHovered";
		}
	}

	this.html.onmouseleave = function(){
		if(this.className!="pieceDeleted" && ((mainGame.moves%2==0 && mainGame.firstPlayer=="player") || (mainGame.moves%2!=0 && mainGame.firstPlayer!="player"))){
			this.className = "piece";
			var length = this.id.length;
			var temp = this.id.indexOf("|");
			var x = parseInt(this.id.slice(5, temp));
			var y = parseInt(this.id.slice(temp+1, length));
			for(; y<mainGame.board.boardQuantityArray[x]; y++)
				document.getElementById("piece" + x + "|" + y).className = "piece";
		}
	}

	this.html.onclick = function(){
		if(this.className!="pieceDeleted" && ((mainGame.moves%2==0 && mainGame.firstPlayer=="player") || (mainGame.moves%2!=0 && mainGame.firstPlayer!="player"))){
			this.deletePiece();
		}
	}

	this.html.deletePiece = function(){
		var length = this.id.length;
		var temp = this.id.indexOf("|");
		var x = parseInt(this.id.slice(5, temp));
		var y = parseInt(this.id.slice(temp+1, length));

		mainGame.deletePiece(x, y);
	}
}

function initiateEventSource(gameId){
	evtSource = new EventSource(url + "update?nick=" + username + "&game=" + gameId);

	evtSource.onmessage = function(packet){
		var json = JSON.parse(packet.data);
		if(json["turn"]!=null){
			if(json["stack"]!=null){
				var x = json["stack"];
				var y = json["pieces"];
				mainGame.deletePieceConfirmation(x, y);
				mainGame.turn = json["turn"];
				mainGame.updateMessageDiv();
				if(mainGame.turn==username)
				setTimer();
			else{
				clearInterval(timer);
				document.getElementById("timerH2").innerHTML = "1m 0s"
			}
			}
			else{
				var firstPlayer = json["turn"];
				mainGame.initiateGame(firstPlayer);
				if(firstPlayer==username)
					setTimer();
				else{
					clearInterval(timer);
					document.getElementById("timerH2").innerHTML = "1m 0s"
				}
			}
		}
		else if(json["winner"]!=null){
			mainGame.endGame(json["winner"]);
		}
		else if(json["error"]){
			if(json["error"]=="Invalid game reference"){
				clearTimeout(timeOutMessage);
				document.getElementById("messageH1").innerHTML = "Error! Incorrect game ID.";
			}
			else{
				clearTimeout(timeOutMessage);
				document.getElementById("messageH1").innerHTML = json["error"];
			}
		}
		else if(json["winner"]==null){
			if(timeLeft<=0){
				setTimeout(function(){
					gameInProgress = false;
					showGameForm(true, true);
					evtSource.close();
				}
				,3000);
			}
			else{
				gameInProgress = false;
				showGameForm(true, true);
				evtSource.close();
			}

		}
	}
}
