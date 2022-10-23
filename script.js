const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')
var tabuleiro;
var starter;
var dificulty;

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
  })
})

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}

//coisas do tabuleiro a partir daqui -------------------------------------------------------------------------------------------------------------------------------------------------------------
const BtnAdd = document.querySelector(".submit");
const DivContainer = document.getElementById("boardgame");
var turn = document.getElementById("playerTurn");
turn.style.display = "none";
var turnPlayer1 = false;
var turnAI = false;


BtnAdd.addEventListener("click", AddNew);

function AddNew() {
  var tabuleiro = document.getElementById("tabuleiro").value;
  //newDiv.classList.add('divrow');
  for (let i =0; i< tabuleiro; i++) {
    var newDiv = document.createElement("div");
    newDiv.id = 'r'+i;
    newDiv.className = 'row';
    for(let j=0;j<=i;j++) {
      var ficha = document.createElement("img");
      ficha.id = 'f'+j;
      ficha.className = 'ficha';
      ficha.src= "piece.png"
      ficha.setAttribute("height", "70");
      ficha.setAttribute("width", "70");
      newDiv.append(ficha);
    }
    DivContainer.appendChild(newDiv);
  }


  var starter= document.getElementById("starter").value;
  turnPlayer1 = (starter == "jogador1");
  turnAI = (starter !== "jogador1");
  

  
  var aux = runningGame();
  while(aux==true){
    if(turnPlayer1){ 
      turn.style.display = "block";
      const BtnPlayer = document.querySelector(".turnPlayer");
      BtnPlayer.addEventListener("click", turnPlayer());
      //while(!a_jogar){console.log("a");}
    }
    else{
      turn.style.display = "none";
      //meter aqui a funcao de ai
    }
    console.log("turn p1 = ",turnPlayer1);
    console.log("turn p1 depois = ",turnPlayer1);
    aux=false;
  }
}

function turnPlayer(){
  var tirarLinha = document.getElementById("tirarLinha").value;
  var tirarFicha = document.getElementById("tirarFichas").value;
  remove_Child("r"+tirarLinha,tirarFicha);
  turnPlayer1=invertTurn(turnPlayer1);
  turnAI=invertTurn(turnAI);
}

function runningGame(){
  var div = DivContainer.getElementsByTagName("div")
  for (let i =0;i <div.length;i++) {
    var row = document.getElementById("r"+i);
    var ficha = row.getElementsByTagName("img");
    if(ficha.length>0){
      return true;
    }
  }
  return false;
}

function invertTurn(jogador){
  if (jogador == true) return false;
  else return true;
}

function remove_Child(ro,fic) {
  var div = DivContainer.getElementsByTagName("div")
  for (let i =0;i <div.length;i++) {
    var row = document.getElementById(ro);
    var ficha = row.getElementsByTagName("img");
    if(fic>ficha.length) fic=ficha.length-1;
    for(let k=fic ; k < (ficha.length) ; k++){
      row.removeChild(ficha[k]);
    }
  }
}

function loseGame() {
  const gamelost = document.getElementById("gamestatus");
  gamelost.innerHTML = "You Lost!";
}

function winGame() {
  const gamewon = document.getElementById("gamestatus");
  gamewon.innerHTML = "You Won!"
}

function aiPCmove() {
  const dif = document.getElementById("dificulty").value;
  const sizeB = document.getElementById("tabuleiro").value;
  switch(dif) {
    case 'facil':
      var div = DivContainer.getElementsByTagName("div")
      var x = Math.floor(Math.random() * sizeB);
      var y = Math.floor(Math.random() * div.length);
      remove_Child("r"+x,y);
  }
}

/*const main = document.querySelector('.boardgame')

window.onload = function tamanho_tabuleiro() {
    let btn = document.getElementById("submit");
    btn.onclick = function(){
      tabuleiro = document.getElementById("tabuleiro").value;
      starter = document.getElementById("starter").value;
      dificulty = document.getElementById("dificulty").value;
      gerCol(tabuleiro);
      startGame();
    }
}

function startGame() {
  var tamanho = document.getElementById("changednumber");
  tamanho.innerHTML = tabuleiro;
  var comeca = document.getElementById("starter11");
  comeca.innerHTML = starter;
  var dificuldade = document.getElementById("dificulty11"); //printar no html o input do forms
  dificuldade.innerHTML = dificulty;
  //alert("Boas");
}

function gerCol(n) {
  for(let i = 0; i < n; i++) {
    console.log(i);
    const ele = document.createElement('s');
    ele.innerHTML = '1';
  }
  //main.style.setPropert('grid-template-columns','repeat(${})');
}

function maker(eleType,parent,html){
  const ele = document.createElement();
  ele.innerHTML = html;
  return parent.appendChild(ele);
}*/